const jet = require('fs-jetpack');
const Page = require('@vuepress/core/lib/prepare/Page')
const {
  parseFrontmatter,
  parseVueFrontmatter: { parse: parseVueFrontmatter }
} = require('@vuepress/shared-utils')


const template_path_comic = './website/.vuepress/comics/ComicWrapper.vue';
const template_path_archive = './website/.vuepress/comics/ArchiveWrapper.vue';
const regex_panel = /\/panel([0-9]*)\.(png|jpe?g)$/;
const regex_share = /\/share\.(png|jpe?g)$/;
const regex_thumbnail = /\/thumbnail\.(png|jpe?g)$/;

module.exports = async function (ctx) {
    console.log("- - - - - - - -");

    const comicDirs = jet.find("./comics", {matching: '*', directories: true, files: false, recursive: false});

    // Fetch info from comic-folders
    let comicData = comicDirs.map(retrieveInformation);

    comicData.sort((a,b) => a.info.date === b.info.date ? 0 : a.info.date < b.info.date ? -1 : 1)

    // Inject vue-template with data
    let injectedComicTemplates = comicData.map(data => injectComicTemplate(data, ctx.markdown));

    // Create VuePress Pages and add them
    // TODO: prev and next
    const injectLength = injectedComicTemplates.length
    for (var i = 0; i < injectLength; i++) {
        const data = comicData[i];
        const content = injectedComicTemplates[i];
        let options = {
            path: `/comic/${data.info.comicID}/`,
            title: data.info.title,
        };
        let page = await createPage(ctx, content, options, `c/${data.info.comicID}`);
        page.frontmatter = {...page.frontmatter, ...{
            prevComic: i===0 ? null : `/comic/${comicData[i-1].info.comicID}/`,
            nextComic: i===injectLength-1 ? null : `/comic/${comicData[i+1].info.comicID}/`,
        }}
    }

    let archivePages = {};
    comicData.forEach(data => {
        const year = data.info.date.getFullYear()
        let archiveInfo = {
            title: data.info.title,
            date: data.info.date,
            path: `/comic/${data.info.comicID}/`,
            thumbnail: data.files.thumbnail,
        }

        if (archivePages[year]) archivePages[year].posts.push(archiveInfo);
        else archivePages[year] = {
            posts: [archiveInfo]
        };
    })
    let recentYear = 0;
    for (let year in archivePages) {
        recentYear = Math.max(year, recentYear);
        archivePages[year].year = Number.parseInt(year);
        archivePages[year].size = archivePages[year].posts.length;
    }
    let years = Object.keys(archivePages);
    let yearsLength = years.length;

    // Inject vue-template with data
    let injectedArchiveTemplates = years.map(i => injectArchiveTemplate(archivePages[i]));

    const createArchivePage = async (i, isRoot=false) => {
        const data = archivePages[years[i]];
        const content = injectedArchiveTemplates[i];
        let options = {
            path: isRoot ? '/archive/' : `/archive/${data.year}/`,
            title: `Archive ${data.year}`,
        };
        let page = await createPage(ctx, content, options, `a/${data.year}`);
        page.frontmatter = {...page.frontmatter, ...{
            prevYear: i===0 ? null : `/archive/${years[i-1]}/`,
            nextYear: i===yearsLength-1 ? null : `/archive/${years[i+1]}/`,
        }}
    }

    for (var i = 0; i < years.length; i++) {
        await createArchivePage(i);
        if (archivePages[years[i]].year === recentYear) {
            await createArchivePage(i, true);
        }
    }


    console.log("- - - - - - - -");
}

async function createPage(ctx, content, options, uid) {
    const file_path = await ctx.writeTemp(`temp-pages/${uid}.vue`, content);
    const page = new Page({...options, ...{filePath: file_path}}, ctx);
    await page.process({
      markdown: ctx.markdown,
      computed: new ctx.ClientComputedMixinConstructor(),
      enhancers: ctx.pluginAPI.options.extendPageData.items
    });
    ctx.pages.push(page);
    return page;
}

const injectHelper = {
    getRegExp: tag => new RegExp(`\\|\\§\\|${tag}\\|\\§\\|`, 'g'),
    wrapRequire: str => `require("../../../../../../${str}")`,
    toExprString: arr => `[${arr.join()}]`
}

function injectComicTemplate(data, markdown) {
    const template = jet.read(template_path_comic);
    let _template = template.slice();

    _template = _template
        .replace(injectHelper.getRegExp('panels'), injectHelper.toExprString(data.files.comics.map(injectHelper.wrapRequire)))
        .replace(injectHelper.getRegExp('share'), injectHelper.wrapRequire(data.files.share))
        .replace(injectHelper.getRegExp('info'), JSON.stringify(data.info))
        .replace(injectHelper.getRegExp('html'), markdown.render(data.content).html)

    return _template;
}

function injectArchiveTemplate(data) {
    const template = jet.read(template_path_archive);
    let _template = template.slice();

    _template = _template
        .replace(injectHelper.getRegExp('year'), data.year)
        .replace(injectHelper.getRegExp('posts_size'), data.size)
        .replace(injectHelper.getRegExp('posts'), JSON.stringify(data.posts))

    return _template;
}

function retrieveInformation(dir) {
    let comicID = Number.parseInt(dir.match(/\d+/)[0])
    let _fileContent = jet.read(`${dir}/README.md`);
    const { excerpt, data, content } = parseFrontmatter(_fileContent)
    let _fileDirectories = jet.find(dir, { matching: '*', recursive: false})
    let files = seperateFiles(_fileDirectories);
    return {info: {...data, ...{comicID}}, excerpt, content, files};
}

function seperateFiles(files) {
    let comics = [];
    let thumbnail = null;
    let share = null;
    files.forEach(file => {
        if (regex_panel.test(file)) comics.push(file);
        else if (regex_share.test(file)) share = file;
        else if (regex_thumbnail.test(file)) thumbnail = file;
    })
    return {comics,thumbnail,share}
}