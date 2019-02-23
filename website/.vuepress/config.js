const path = require('path');

const Page = require('@vuepress/core/lib/prepare/Page')
const { parseVueFrontmatter: { parse: parseVueFrontmatter } } = require('@vuepress/shared-utils')
const container = require('markdown-it-container');

const comicsDir = "_comics"
let comics = [];
let sortedYears = [];

module.exports = ctx => ({
    host: '0.0.0.0',
    //base: '/dist/',
    title: 'Pretends to be Drawing',
    themeConfig: {
        domain: 'https://ptbd.jwels.berlin',
        primary: [{label: 'About', link: '/about'}, {label: 'Archive', link: '/archive'}],
        secondary: [{label: 'Twitter', link: '//twitter.com/JulianWels'}, {label: 'Facebook', link: '//facebook.com/pretendstobedrawing/'}, {label: 'Instagram', link: '//instagram.com/pretendstobedrawing/'}, {label: 'RSS', link: '/feed'}],
    },
    plugins: [
        require('./comics/create-comic-pages.js'),
        (pluginOptions, context) => ({
            name: '@vuepress/last-updated',
            transformer: ts => new Date(ts).toISOString(),
        }),
        (pluginOptions, context) => ({
            name: 'sitemap',
            hostname: 'https://ptbd.jwels.berlin/',
        }),
    ],
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
    chainWebpack: config => {
        config.module.rules.delete('images')
        config.module.rules.delete('svg')
        config.module
            .rule('panels')
                .test(/(panel([0-9]*)|thumbnail)\.(png|jpe?g|gif)(\?.*)?$/)
                    .use('lqip-loader')
                        .loader('lqip-loader')
                        .options({
                            base64: true,
                            palette: false
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
        config.module
            .rule('svg-icon')
                .test(/icon_(.*)\.(svg)(\?.*)?$/)
                .use('svg-inline-loader')
                    .loader('svg-inline-loader')
        //config.module
        //    .rule('svg')
        //        .test(/\.(svg)(\?.*)?$/)
        //        .use('file-loader')
        //            .loader('file-loader')
        //            .options({
        //                name: `assets/img/[name].[hash:8].[ext]`
        //            })
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