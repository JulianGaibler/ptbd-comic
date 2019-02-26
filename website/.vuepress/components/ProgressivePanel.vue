<template>
    <figure aria-hidden class="progressive-img">
        <div :style="{'padding-bottom': `${img.hRatio}%`}" />
        <img v-if="$ssrContext" class="full" :src="img.path.preSrc">
        <template v-else>
            <img class="preview" ref="preview" :src="img.path.preSrc" />
            <img ref="full" class="full overlay willAnimate" />
        </template>
    </figure>
</template>

<script>
require('intersection-observer')
import Vue from 'Vue'

export default {
    name: 'ProgressivePanel',
    props: {
        img: {
            required: true,
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

            downloadingImage.src = this.img.path.src;
        }
    }
}
</script>