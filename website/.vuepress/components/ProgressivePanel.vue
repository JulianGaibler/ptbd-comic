<template>
    <figure class="progressive-img">
        <img class="preview" ref="preview" :src="base64" />
        <img ref="full" class="full willAnimate" />
        <noscript>
            <img class="full" :src="imgsrc">
        </noscript>
    </figure>
</template>

<script>
import Vue from 'Vue'

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
            type: Number,
            default: -1
        },
        observeIntersect: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {

        }
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.observeIntersect || !'IntersectionObserver' in window) {
                this.download();
            } else {
                let observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) return;
                        this.download();
                        observer.disconnect()
                    })
                }, {
                    threshold: 0.1
                })
                observer.observe(this.$refs.preview);
            }
        })
    },
    methods: {
        download() {
            const imageRef = this.$refs.full;
            let downloadingImage = new Image();
            const that = this;
            let currTime = new Date();
            downloadingImage.onload = function() {
                let diff = (new Date()) - currTime;
                if (diff > that.animationThreshold) {
                    imageRef.classList.add('loaded');
                    imageRef.src = this.src;
                } else {
                    imageRef.src = this.src;
                }
            }

            downloadingImage.src = this.imgsrc;
        }
    }
}
</script>