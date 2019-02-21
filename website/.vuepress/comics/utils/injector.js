const jet = require('fs-jetpack')

const template_path_comic = './website/.vuepress/comics/ComicWrapper.vue';
const template_path_archive = './website/.vuepress/comics/ArchiveWrapper.vue';

function comicTemplate(data, markdown) {
    const template = jet.read(template_path_comic);
    let _template = template.slice();
    _template = _template
        .replace(getRegExp('panels'), toExprString(data.files.comics.map(wrapRequire)))
        .replace(getRegExp('share'), wrapRequire(data.files.share))
        .replace(getRegExp('thumbnail'), wrapRequire(data.files.thumbnail))
        .replace(getRegExp('info'), JSON.stringify(data.info))
        .replace(getRegExp('html'), data.content)

    return _template;
}

function archiveTemplate(data) {
    const template = jet.read(template_path_archive);
    let _template = template.slice();

    let postData = JSON.stringify(data.posts);
    // Can this endless path traversal be shortened?
    postData = postData.replace(/"(thumbnail)":"([^,]*)"/g, 'thumbnail: require("../../../../../../$2")')

    _template = _template
        .replace(getRegExp('year'), data.year)
        .replace(getRegExp('posts_size'), data.size)
        .replace(getRegExp('posts'), postData)

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

module.exports = {comicTemplate, archiveTemplate}