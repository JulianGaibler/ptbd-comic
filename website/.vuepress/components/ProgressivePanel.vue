<template>
    <figure class="progressive-img">
        <img class="preview" ref="preview" :src="base64" />
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
    props: {
        base64: {
            type: String,
        },
        imgsrc: {
            type: String,
        },
        animationThreshold: {
            type: String,
        },
        observeIntersect: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            loadedsrc: undefined,
            loadingIndicator: false,
            classes: ['full']
        }
    },
    beforeMount() {
        if (!this.observeIntersect || !'IntersectionObserver' in window) {
            this.download();
        }
    },
    mounted() {
        if (this.observeIntersect && 'IntersectionObserver' in window) {
            let observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    console.log(entry.isIntersecting);
                    if (!entry.isIntersecting) return;
                    this.download();
                    observer.disconnect()
                })
            }, {
                threshold: 0.1
            })
            observer.observe(this.$refs.preview);
        }
    },
    methods: {
        download() {
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
                that.classes.push('willAnimate');
                if (!this.loadedsrc) this.loadingIndicator = true;
            }, loading_threshold)
    
            downloadingImage.src = this.imgsrc;
        }
    }
}
</script>