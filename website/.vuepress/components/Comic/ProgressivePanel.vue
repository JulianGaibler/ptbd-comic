<template>
    <figure>
        <img class="preview" :src="base64" />
        <div v-if="loadingIndicator" class="indicator"><span>Loading...</span></div>
        <img :class="classes" :src="loadedsrc" />
        <noscript>
            <img class="full" :src="imgsrc">
        </noscript>
    </figure>
</template>

<script>
const loading_threshold = 1000;

export default {
    name: 'ProgressivePanel',
    props: ['base64', 'imgsrc'],
    data() {
        return {
            loadedsrc: undefined,
            loadingIndicator: false,
            classes: ['full']
        }
    },
    beforeMount() {
        let downloadingImage = new Image();
        let that = this;
        let currTime = new Date();
        downloadingImage.onload = function() {
            let diff = (new Date()) - currTime;
            if (diff > loading_threshold) {
                that.classes.push('loaded');
            }
            that.loadingIndicator = false;
            that.loadedsrc = this.src;
        }

        setTimeout(()=>{
            if (!this.loadedsrc) this.loadingIndicator = true;
        }, loading_threshold)

        downloadingImage.src = this.imgsrc;
    }
}
</script>