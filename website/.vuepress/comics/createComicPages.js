const jet = require('fs-jetpack');
const Page = require('@vuepress/core/lib/prepare/Page')
const {
  parseFrontmatter,
  parseVueFrontmatter: { parse: parseVueFrontmatter }
} = require('@vuepress/shared-utils')


const template_path = './website/.vuepress/comics/Comic.vue';
const regex_panel = /\/panel([0-9]*)\.(png|jpe?g)$/;
const regex_share = /\/share\.(png|jpe?g)$/;
const regex_thumbnail = /\/thumbnail\.(png|jpe?g)$/;

module.exports = async function (ctx) {
	console.log("- - - - - - - -");

	const template = jet.read(template_path);
	const comicDirs = jet.find("./comics", {matching: '*', directories: true, files: false, recursive: false});

	// Fetch info from comic-folders
	let comicData = comicDirs.map(retrieveInformation);

	// Inject vue-template with data
	let injectedTemplates = comicData.map(data => injectTemplate(template, data));

	// Create VuePress Pages and add them
	for (var i = 0; i < injectedTemplates.length; i++) {
		const data = comicData[i];
		const content = injectedTemplates[i];
		let options = {
            path: `/comic/${data.info.comicID}/`,
            title: data.info.title,
        };
		await createPage(ctx, content, options, data.info.comicID);
	}



	console.log("- - - - - - - -");
}

async function createPage(ctx, content, options, uid) {
	console.log(content)
    const file_path = await ctx.writeTemp(`temp-pages/c/${uid}.vue`, content);
    console.log(file_path);
    const page = new Page({...options, ...{filePath: file_path}}, ctx);
    await page.process({
      markdown: ctx.markdown,
      computed: new ctx.ClientComputedMixinConstructor(),
      enhancers: ctx.pluginAPI.options.extendPageData.items
    });
    console.log(page.frontmatter);
    ctx.pages.push(page);
}

function injectTemplate(template, data) {
	let _template = template.slice();

	const getRx = tag => new RegExp(`\\|\\§\\|${tag}\\|\\§\\|`, 'g');

	const wrapRequire = str => `require("../../../../../../${str}")`;
	const toExprString = arr => `[${arr.join()}]`;

	_template = _template
		.replace(getRx('panels'), toExprString(data.files.comics.map(wrapRequire)))
		.replace(getRx('share'), wrapRequire(data.files.share))
		.replace(getRx('info'), JSON.stringify(data.info))

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