<template>
	<article class="comicpage">
		<h1>{{info.title}}</h1>
		<div class="panels">
			<ProgressivePanel v-for="panel in panels" :base64="panel.preSrc" :imgsrc="panel.src" />
		</div>

		<ComicNav 
			:prev="$page.frontmatter.prevComic"
			:next="$page.frontmatter.nextComic"
			:share="share"
		/>
        <div class="description">
        	<slot />
        </div>
    </article>
</template>

<script>
import ProgressivePanel from './ProgressivePanel.vue'
import ComicNav from './Comic/ComicNav.vue'

export default {
	props: ['info', 'panels', 'share'],
	components: { ProgressivePanel, ComicNav }
}
</script>