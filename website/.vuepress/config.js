const path = require('path');

const Page = require('@vuepress/core/lib/prepare/Page')
const createComicPages = require('./comics/createComicPages')
const { parseVueFrontmatter: { parse: parseVueFrontmatter } } = require('@vuepress/shared-utils')
const container = require('markdown-it-container');

const comicsDir = "_comics"
let comics = [];
let sortedYears = [];

async function addPage(options, ctx) {
    options.permalinkPattern = ctx.siteConfig.permalink
    const _content = `
<template>
    <main class="comicpage" aria-labelledby="main-title">
        <h1></h1>
        <p></p>
    </main>
</template>

<script>
const info = {"title":"Dental Differentiation","date":"2019-02-12T12:43:00.000Z","comicID":94};
const panels = [require("../../../../../comics/94/panel1.png"),require("../../../../../comics/94/panel2.png"),require("../../../../../comics/94/panel3.png"),require("../../../../../comics/94/panel4.png")];
const share = require("../../../../../comics/94/share.png");

export default {
    data: function () {
        return {
            info, panels, share
        }
    },
}
</script>
    `
    const file_path = await ctx.writeTemp(`temp-pages/test.vue`, _content);
    const page = new Page({...options, ...{filePath: file_path}}, ctx);
    await page.process({
      markdown: ctx.markdown,
      computed: new ctx.ClientComputedMixinConstructor(),
      enhancers: ctx.pluginAPI.options.extendPageData.items
    });
    ctx.pages.push(page);

}

module.exports = ctx => ({
    title: 'Pretends to be Drawing',
    themeConfig: {
        primary: [{label: 'About', link: '/about'}, {label: 'Archive', link: '/archive'}],
        secondary: [{label: 'Twitter', link: '//twitter.com/JulianWels'}, {label: 'Facebook', link: '//facebook.com/pretendstobedrawing/'}, {label: 'Instagram', link: '//instagram.com/pretendstobedrawing/'}, {label: 'RSS', link: '/feed'}],
    },
    // Get's called first
    extendPageData(page) {
        if (!page.regularPath.startsWith(`/${comicsDir}`)) return;
        page.frontmatter.permalink = `/comic/${page.frontmatter.comic_id}/`;
        page.frontmatter.type = 'comic';
        page.files = {};
        comics.push(page);
        console.log(page);
    },
    // Get's called after that
    async ready () {
        await createComicPages(ctx);
        return;
        // That's why comics array is filled.
        comics.sort();
        let _comics = comics.slice();

        {
            const last_idx = _comics.length-1;
            _comics.forEach((comic, idx) => {
                comic.frontmatter.comic_last = (idx > 0) ? _comics[idx-1].frontmatter.permalink : null;
                comic.frontmatter.comic_next = (idx < last_idx) ? _comics[idx+1].frontmatter.permalink : null;

                //let panels = require.context("../"+comic.regularPath, false, /\/panel([0-9]*)\.(png|jpe?g)$/);
                
            })
        }

        {
            const getYear = c => c.frontmatter.date.getFullYear();
            while (_comics.length > 0) {
                const year = getYear(_comics[0]);
                const last_idx = _comics.length-1;
                let until = 1;
                while (until < last_idx && getYear(_comics[until]) != year) {
                    until++;
                }
                sortedYears[year] = _comics.splice(0, until).map(item => item.frontmatter);
            }
        }

        // Generate Archive
        let all_years = Object.keys(sortedYears);
        all_years.forEach(year => {
            ctx.addPage({
                path: `/archive/${year}/`,
                title: `Archive ${year}`,
                frontmatter: {
                    type: 'archive',
                    year: year,
                    comics: sortedYears[year],
                }
            });
        })
        const current_year = all_years[all_years.length-1];
        ctx.addPage({
            path: '/archive/',
            title: `Archive ${current_year}`,
            frontmatter: {
                type: 'archive',
                year: current_year,
                comics: sortedYears[current_year],
            }
        })
    },
    chainWebpack: config => {
        config.module.rules.delete('images')
        config.module
            .rule('panels')
                .test(/panel([0-9]*)\.(png|jpe?g|gif)(\?.*)?$/)
                    .use('lqip-loader')
                        .loader('lqip-loader')
                        .options({
                            base64: true,
                            palette: false
                        });
        config.module
            .rule('thumbnails')
                .test(/thumbnail\.(png|jpe?g|gif)(\?.*)?$/)
                    .use('lqip-loader')
                        .loader('lqip-loader')
                        .options({
                            base64: false,
                            palette: true
                        });
        config.module
            .rule('images')
                .test(/\.(png|jpe?g|gif)(\?.*)?$/)
                    .use('url-loader')
                        .loader('url-loader')
                        .options({
                            limit: 1000,
                            name: `assets/img/[name].[hash:8].[ext]`
                        });
    },
    markdown: {
        extendMarkdown: md => {
            md.use(container, 'hidden', {
                render: function(tokens, idx) {
                    const token = tokens[idx]
                    if (token.nesting === 1) {
                        return `<div class="hidden">\n`
                    } else {
                        return `</div>\n`
                    }
                }
            });
        }
    }
});