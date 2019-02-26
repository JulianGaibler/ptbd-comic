const path = require('path');
const jet = require('fs-jetpack')

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
    description: `Listen like no one is singing. Watch like nobody's dancing. Pretend like no one is drawing. This is a Webcomic. I hope.`,
    head: [
        ['meta', { name: 'theme-color', content: '#db503e' }],
        ['meta', { name: 'apple-mobile-web-app-title', content: 'Pretends to be Drawing' }],
        ['meta', { name: 'application-name', content: 'Pretends to be Drawing' }],
        ['meta', { name: 'msapplication-TileColor', content: '#da532c' }],
        ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
        ['link', { rel: 'manifest', href: '/site.webmanifest' }],
        ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ff543c' }],
        ['script', {}, jet.read(path.resolve(__dirname, 'headScript.js')) ],
    ],
    themeConfig: {
        domain: 'https://ptbd.jwels.berlin',
        primary: [{label: 'About', link: '/about'}, {label: 'Archive', link: '/archive'}],
        secondary: [{label: 'Twitter', link: '//twitter.com/JulianWels'}, {label: 'Facebook', link: '//facebook.com/pretendstobedrawing/'}, {label: 'Instagram', link: '//instagram.com/pretendstobedrawing/'}, {label: 'RSS', link: '/feed'}],
    },
    clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js'),
    plugins: [
        require('./comics/create-comic-pages.js'),
        ['@vuepress/last-updated', {
            transformer: ts => new Date(ts).toISOString()
        }],
        ['vuepress-plugin-sitemap', {
            hostname: 'https://ptbd.jwels.berlin/',
            changefreq: 'weekly'
        }]
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
            .rule('images')
                .test(/\.(png|jpe?g|gif)(\?.*)?$/)
                .oneOf('panels')
                    .test(/\/panel([0-9]{1,})\./)
                    .use('lqip-loader')
                        .loader('lqip-loader')
                        .options({
                            base64: true,
                            palette: false
                        })
                        .end() 
                    .end()    
                .oneOf('thumbnails')
                    .test(/thumbnail\./)
                    .use('lqip-loader')
                        .loader('lqip-loader')
                        .options({
                            base64: true,
                            palette: false
                        })
                        .end()
                    .use('file-loader')
                        .loader('file-loader')
                        .options({
                            name(path) {
                                const arr = path.match(/(?<=\/)((\d{1,})(?=\/))/g);
                                const last = arr[arr.length-1];
                                return `assets/thumbnail/${last}.[ext]`;
                            }
                        })
                        .end()
                    .end()
                .oneOf('share')
                    .test(/share\./)
                    .use('file-loader')
                        .loader('file-loader')
                        .options({
                            name: (path) => {
                                const arr = path.match(/(?<=\/)((\d{1,4})(?=\/))/g);
                                const last = arr[arr.length-1];
                                return `share/${last}.[ext]`;
                            }
                        })
                        .end()
                    .end()
                .oneOf('allimages')
                    .use('url-loader')
                        .loader('url-loader')
                        .options({
                            limit: 1000,
                            name: `assets/img/[name].[hash:8].[ext]`
                        })

        config.module
            .rule('svg')
                .test(/\.(svg)(\?.*)?$/)
                .oneOf('icons')
                    .test(/icon_(.*)/)
                    .use('svg-inline-loader')
                        .loader('svg-inline-loader')
                        .end()
                    .end()
                .oneOf('share')
                    .use('file-loader')
                        .loader('file-loader')
                        .options({
                            name: `assets/img/[name].[hash:8].[ext]`
                        })
    },
    markdown: {
        anchor: {permalink: false},
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