<template>
	<article class="comicpage">
		<h1>{{info.title}}</h1>
		<time :datetime="info.date">{{getDateStr(info.date)}}</time>
		<div :class="classes">
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
    data: function () {
    	const cid = this.info.comicID;
    	const panelsLen = this.panels.length;
    	let info = [];
    	if (cid < 46 && panelsLen < 3) info = ['legacy']
    	else if (panelsLen < 3) info = ['col1']
        return {
           classes: ['panels', ...info]
        }
    },
	components: { ProgressivePanel, ComicNav }
    methods: {
    	getDateStr(date) {
            return DateTime.fromISO(date).toLocal().toFormat('dd LLL yyyy')
        },
    },
}
</script>