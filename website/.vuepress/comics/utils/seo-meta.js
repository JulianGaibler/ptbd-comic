/**
 * Forked from https://github.com/lorisleiva/vuepress-plugin-seo
 */

module.exports = ($page, context, options = {}) => {
    options = {...defaultOptions, ...options}

    const $site = context.siteConfig

    let addMeta = (name, content, attribute = null) => {
        if (! content) return
        if (! attribute) attribute = ['article:', 'og:'].some(type => name.startsWith(type)) ? 'property' : 'name'
        meta.push({ [attribute]: name, content })
    }
    let meta = $page.frontmatter.meta || []
    let optionArgs = [ $page, $site ]
    let metaContext = {
        $page, $site,
        siteTitle: options.siteTitle(...optionArgs),
        title: options.title(...optionArgs),
        description: options.description(...optionArgs),
        author: options.author(...optionArgs),
        tags: options.tags(...optionArgs),
        twitterCard: options.twitterCard(...optionArgs),
        type: options.type(...optionArgs),
        url: options.url(...optionArgs),
        image: options.image(...optionArgs),
        publishedAt: options.publishedAt(...optionArgs),
        modifiedAt: options.modifiedAt(...optionArgs),
    }
    
    options.defaultMeta(addMeta, metaContext)
    options.customMeta(addMeta, metaContext)
    $page.frontmatter.meta = meta
}

const defaultOptions = {
    siteTitle: (_, $site) => $site.title,
    title: $page => $page.title,
    description: $page => $page.frontmatter.description ? $page.frontmatter.description : $page._description ? $page._description : undefined,
    author: ($page) => $page.frontmatter.author ? $page.frontmatter.author : {name: 'Julian Wels', twitter: '@JulianWels'},
    tags: $page => [...($page.frontmatter.tags ? $page.frontmatter.tags : []), ...['Webcomic', 'Comic', 'ptbd']],
    twitterCard: _ => 'summary_large_image',
    type: $page => ['comics', 'posts', 'blog'].some(folder => $page.regularPath.startsWith('/' + folder)) ? 'article' : 'website',
    url: ($page, $site) => ($site.themeConfig.domain || '') + $page.path,
    image: ($page, $site) => ($site.themeConfig.domain || '') + '/default-banner.png',
    publishedAt: $page => $page.frontmatter.date && (new Date($page.frontmatter.date)).toISOString(),
    modifiedAt: $page => $page.lastUpdated && (new Date($page.lastUpdated)).toISOString(),
    customMeta: () => {},

    defaultMeta(add, ctx) {
        const { author, tags } = ctx

        // Basics.
        add('twitter:image', ctx.image)
        add('og:image', ctx.image)
        add('description', ctx.description)
        add('article:published_time', ctx.publishedAt)
        add('article:modified_time', ctx.modifiedAt)
        add('og:site_name', ctx.siteTitle)
        add('og:title', ctx.title)
        add('og:description', ctx.description)
        add('og:type', ctx.type)
        add('og:url', ctx.url)
        add('twitter:title', ctx.title)
        add('twitter:description', ctx.description)
        add('twitter:url', ctx.url)
        add('twitter:card', ctx.twitterCard)

        // Author.
        if (author) {
            add('twitter:label1', 'Created by')
            add('twitter:data2', author.name ? author.name : author)
            if (author.twitter) add('twitter:creator', author.twitter)
        }

        // Tags.
        if (tags && Array.isArray(tags)) {
            add('twitter:label2', 'Filed under')
            add('twitter:data2', tags.join(', '))
            tags.forEach(tag => add('article:tag', tag))
        }
    },
}