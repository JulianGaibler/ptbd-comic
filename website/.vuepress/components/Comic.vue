<template>
	<div>
		<div>
			<div v-for="panel in panels" :style="{width: '5rem', height: '5rem'}">
				<ProgressivePanel :base64="panel.preSrc" :imgsrc="panel.src" />
			</div>
		</div>
        <slot />   
    </div>
</template>

<script>
import ProgressivePanel from './Comic/ProgressivePanel.vue'

export default {
	props: ['info', 'panels', 'share'],
	components: { ProgressivePanel }
}
</script>