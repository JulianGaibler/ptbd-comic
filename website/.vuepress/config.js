const path = require('path');
const container = require('markdown-it-container');

const comicsDir = "_comics"
let comics = [];
let sortedYears = [];

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
    },
    // Get's called after that
    ready () {
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
        });
    },
    async clientDynamicModules () {
        return {
            name: 'comics.js',
            content: `export default ${JSON.stringify(sortedYears, null, 2)}`
        }
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