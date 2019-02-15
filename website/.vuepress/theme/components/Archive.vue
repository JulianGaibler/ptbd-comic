<template>
    <main>
        <h1>{{$page.frontmatter.year}}</h1>
        <ul>
        	<li v-for="comic in archiveFiles">{{comic.title}} - {{comic.files}}</li>
        </ul>
        <Content />
    </main>
</template>

<script>
let thumbnails = require.context("../", true, /\/thumbnail\.(png|jpe?g)$/);
thumbnails = thumbnails.keys().map(thumbnails)

export default {
	computed: {
		archiveFiles() {
			return this.$page.frontmatter.comics.map(comic => {
				let page = this.$site.pages.find(i => i.frontmatter.comic_id === comic.comic_id);
				return {...comic, ...{
					files: page.files,
				}}
			})
		}
	}
}
</script>