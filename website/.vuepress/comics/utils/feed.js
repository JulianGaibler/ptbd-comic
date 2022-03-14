const Feed = require('feed').Feed
const jet = require('fs-jetpack')
const path = require('path')

module.exports = (comicData, context) => {
    const $site = context.siteConfig
    const domain = $site.themeConfig.domain

    const feed = new Feed({
        title: $site.title,
        description: $site.description,
        id: domain,
        link: domain,
        image: `${domain}/default-banner.png`,
        favicon: `${domain}/favicon.ico`,
        copyright: `Julian Wels 2016-${(new Date()).getFullYear()}`,
        feedLinks: {
            atom: `${domain}/feed`,
            json: `${domain}/feed/rss`
        },
        author: {
            name: "Julian Wels",
            link: "https://jwels.berlin/"
        }
    });

    comicData.forEach(comic => {
        let author = comic.info.author
            ? [{name:(comic.info.author.name?comic.info.author.name:comic.info.author)}]
            : [{name:"Julian Wels"}];
        feed.addItem({
            title: comic.info.title,
            id: ''+comic.info.comicID,
            link: `${domain}/comic/${comic.info.comicID}/`,
            description: comic.info.description,
            content: `
                <img src="${domain}/share/${comic.info.comicID}.png">
                ${comic.content}
            `,
            author,
            date: comic.info.date,
            image: `${domain}/assets/thumbnail/${comic.info.comicID}.jpg`
        })
    })

    jet.writeAsync(path.resolve(context.outDir, 'feed', 'index.xml'), feed.atom1());
    jet.writeAsync(path.resolve(context.outDir, 'feed', 'rss', 'index.xml'), feed.rss2());
    jet.writeAsync(path.resolve(context.outDir, 'feed', 'json', 'index.json'), feed.json1());
}