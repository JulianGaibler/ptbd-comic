const chalk = require('chalk')
const Page = require('@vuepress/core/lib/node/Page')
const createMarkdown = require('@vuepress/core/lib/node/createMarkdown')

const seoMeta = require('./utils/seo-meta.js');
const feed = require('./utils/feed.js');
const fileFetcher = require('./utils/file-fetcher.js')
const injector = require('./utils/injector.js')

let comicData

module.exports = (options, ctx) => {
    return {
        async ready() {
            console.log(chalk.blue.underline("\nPtbD-Comic Import\n"));

            // Create meta-tags for all static pages
            ctx.pages.forEach(page => {
                seoMeta(page, ctx, {
                    author: () => undefined,
                })
            })

            // This happens in core but right after the user-plugins, so we have to do it here now
            let markdown = createMarkdown(ctx)

            // Fetch info from comic-folders
            console.log(`${chalk.cyan("wait")} Fetching comic files and extracting data...`);
            comicData = fileFetcher.fetchAll('./comics', markdown);
            console.log(`${chalk.yellow("PtbD")} Found ${comicData.length} comics: [${comicData.map(c=>c.info.comicID)}]`);

            // Sort comics by date
            comicData.sort((a,b) => a.info.date === b.info.date ? 0 : a.info.date < b.info.date ? -1 : 1)

            if (!ctx.isProd) {
                const len = comicData.length;
                comicData = comicData.slice(len-16, len-1);
            }

            await createComicPages(comicData, ctx);

            await createArchivePages(comicData, ctx);

        },
        async generated() {
            if (comicData)
                feed(comicData, ctx)
        }
    }
}

async function createComicPages(comicData, ctx) {
    // Inject vue-template with data
    let injectedComicTemplates = comicData.map(data => injector.comicTemplate(data));

    // Create VuePress Pages and add them
    const injectLength = injectedComicTemplates.length
    const newPage = async (i, isRoot=false) => {
        const data = comicData[i];
        const content = injectedComicTemplates[i];
        let options = {
            path: isRoot ? '/' : `/comic/${data.info.comicID}/`,
            title: data.info.title,
        };
        let page = await createPage(ctx, content, options, `c/${data.info.comicID}${isRoot ? 'r' : ''}`);
        page.frontmatter = {...page.frontmatter, ...data.info, ...{
            home: isRoot,
            layout: 'default',
            prevComic: i===0 ? null : `/comic/${comicData[i-1].info.comicID}/`,
            nextComic: i===injectLength-1 ? null : `/comic/${comicData[i+1].info.comicID}/`,
        }}

        page._description = data.excerpt;
        page.lastUpdated = data.lastUpdated.toISOString();

        if (isRoot) seoMeta(page, ctx, {
            title: () => 'Pretends to be Drawing',
            description: () => ctx.siteConfig.description,
            author: () => undefined,
            tags: () => ['Webcomic', 'Comic', 'ptbd', 'Julian Wels', 'jWels'],
        })
        else seoMeta(page, ctx, {
            image: (_, $site) => `${$site.themeConfig.domain || ''}/assets/thumbnail/${data.info.comicID}.jpg`
        })
    }

    for (var i = 0; i < injectLength; i++) {
        await newPage(i);
        if (i+1 === injectLength) {
            await newPage(i, true);
        }
    }
}

async function createArchivePages(comicData, ctx) {
    let archivePages = {};
    comicData.forEach(data => {
        const year = data.info.date.getFullYear()
        let archiveInfo = {
            title: data.info.title,
            date: data.info.date,
            path: `/comic/${data.info.comicID}/`,
            thumbnail: data.files.thumbnail,
        }

        if (archivePages[year]) {
            archivePages[year].posts.push(archiveInfo);
            if (data.lastUpdated > archivePages[year].lastUpdated) {
                archivePages[year].lastUpdated = data.lastUpdated;
            }
        }
        else archivePages[year] = {
            posts: [archiveInfo],
            lastUpdated: data.lastUpdated,
        };
    })
    let recentYear = 0;
    for (let year in archivePages) {
        recentYear = Math.max(year, recentYear);
        archivePages[year].year = Number.parseInt(year);
        archivePages[year].posts.reverse();
        archivePages[year].size = archivePages[year].posts.length;
    }
    let years = Object.keys(archivePages);
    let yearsLength = years.length;

    console.log(`${chalk.yellow("PtbD")} Created archives for [${years}]`);

    // Inject vue-template with data
    let injectedArchiveTemplates = years.map(i => injector.archiveTemplate(archivePages[i]));

    const newPage = async (i, isRoot=false) => {
        const data = archivePages[years[i]];
        const content = injectedArchiveTemplates[i];
        let options = {
            path: isRoot ? '/archive/' : `/archive/${data.year}/`,
            title: isRoot ? 'Archive' : `Archive ${data.year}`,
        };
        let page = await createPage(ctx, content, options, `a/${data.year}${isRoot ? 'r' : ''}`);
        page.frontmatter = {...page.frontmatter, ...{
            prevYear: i===0 ? null : `/archive/${years[i-1]}/`,
            nextYear: i===yearsLength-1 ? null : `/archive/${years[i+1]}/`,
        }}
        page.lastUpdated = data.lastUpdated.toISOString();

        if (isRoot) seoMeta(page, ctx, {
            description: () => `PtbD-Archive for the year ${data.year}`,
            author: () => undefined,
            tags: () => ['Archive', 'ptbd', data.year],
        })
        else seoMeta(page, ctx, {
            description: () => 'PtbD-Archive for the current year',
            author: () => undefined,
            tags: () => ['Archive', 'ptbd'],
        })
    }

    for (var i = 0; i < years.length; i++) {
        await newPage(i);
        if (archivePages[years[i]].year === recentYear) {
            await newPage(i, true);
        }
    }
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