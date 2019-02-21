const jet = require('fs-jetpack')
const spawn = require('cross-spawn')
const HTMLParser = require('node-html-parser');
const { parseFrontmatter} = require('@vuepress/shared-utils')

const regex_panel = /\/panel([0-9]*)\.(png|jpe?g)$/;
const regex_share = /\/share\.(png|jpe?g)$/;
const regex_thumbnail = /\/thumbnail\.(png|jpe?g)$/;

function fetchAll(dir, markdown) {
    const comicDirs = jet.find(dir, {matching: '*', directories: true, files: false, recursive: false});

    // Fetch info from comic-folders
    return comicDirs.map(d => fetch(d, markdown));
}

function fetch(dir, markdown) {
    const comicID = Number.parseInt(dir.match(/\d+/)[0])
    const _fileContent = jet.read(`${dir}/README.md`);
    const lastUpdated = getGitLastUpdatedTimeStamp(`${dir}/README.md`)
    const { _, data, content } = parseFrontmatter(_fileContent)

    let html = markdown.render(content).html;
    let excerpt = HTMLParser.parse(html).querySelector('p').text; // TODO error

    const _fileDirectories = jet.find(dir, { matching: '*', recursive: false})
    const files = seperateFiles(_fileDirectories);
    
    return {
        info: {...data, ...{comicID}},
        excerpt,
        content: html,
        files,
        lastUpdated
    };
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

function getGitLastUpdatedTimeStamp(filePath) {
    let lastUpdated
    try {
        const temp = lastUpdated = parseInt(spawn.sync('git', ['log', '-1', '--format=%ct', filePath]).stdout.toString('utf-8')) * 1000;
        lastUpdated = new Date(temp);
    } catch (e) { console.error(e) }
    return lastUpdated
}

module.exports = {fetchAll, fetch};