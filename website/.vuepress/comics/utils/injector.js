const jet = require('fs-jetpack')

const template_path_comic = './website/.vuepress/comics/ComicWrapper.vue';
const template_path_archive = './website/.vuepress/comics/ArchiveWrapper.vue';

function comicTemplate(data, markdown) {
    const template = jet.read(template_path_comic);
    let _template = template.slice();
    _template = _template
        .replace(getRegExp('panels'), toExprString(data.files.comics.map(wrapWithAspectRatio)))
        .replace(getRegExp('share'), wrapRequire(data.files.share))
        .replace(getRegExp('info'), JSON.stringify(data.info))
        .replace(getRegExp('html'), data.content)

    return _template;
}

function archiveTemplate(data) {
    const template = jet.read(template_path_archive);
    let _template = template.slice();

    let postData = [];
    data.posts.forEach(post => {
        let t = post.thumbnail;
        delete post.thumbnail;
        let str = JSON.stringify(post)

        let insert = str.length - 1;
        let res = str.slice(0, insert) + ',thumbnail:' + wrapWithAspectRatio(t) + str.slice(insert);

        post.thumbail = t;

        postData.push(res)
    })

    _template = _template
        .replace(getRegExp('year'), data.year)
        .replace(getRegExp('posts_size'), data.size)
        .replace(getRegExp('posts'), toExprString(postData))

    return _template;
}

function getRegExp(tag) {
    return new RegExp(`\\|\\§\\|${tag}\\|\\§\\|`, 'g')
}
function wrapRequire(str) {
    return `require("../../../../../../${str}")`
}
function toExprString(arr) {
    return `[${arr.join()}]`
}

function wrapWithAspectRatio({path, hRatio}) {
    return `{path: ${wrapRequire(path)}, hRatio: ${hRatio}}`
}

module.exports = {comicTemplate, archiveTemplate}