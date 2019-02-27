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
import Vue from 'Vue'

export default {
    name: 'ProgressivePanel',
    props: {
        img: {
            required: true,
        },
        animationThreshold: {
            type: Number,
            default: 100
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
            if (!this.observeIntersect || !('IntersectionObserver' in window)) {
                this.download();
            } else {
                let observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) return;
                        this.download();
                        observer.disconnect()
                    })
                }, {
                    threshold: 0
                })
                observer.observe(this.$refs.preview);
            }
        })
    },
    methods: {
        download() {
            const imageRef = this.$refs.full;
            const previewRef = this.$refs.preview;
            const animationEvent = this.whichAnimationEvent();
            const animationThreshold = this.animationThreshold;

            let downloadingImage = new Image();
            let currTime = new Date();
            let loaded = false;

            downloadingImage.onload = function() {
                loaded = true;
                let diff = (new Date()) - currTime;
                animationEvent && imageRef.addEventListener(animationEvent, () => {
                    previewRef.src = '';
                    previewRef.classList.add('hidden');
                });
                if (diff > animationThreshold) {
                    imageRef.classList.add('loaded');
                } else {
                    imageRef.classList.add('loaded-quick');
                }
                imageRef.src = this.src;
            }

            downloadingImage.src = this.img.path.src;
        },
        whichAnimationEvent(){
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'WebkitAnimation' :'webkitAnimationEnd',
                'MozAnimation'    :'animationend',
                'MSAnimation'     :'msAnimationEnd',
                'OAnimation'      :'oAnimationEnd',
                'animation'       :'animationEnd'
            }
        
            for(t in transitions){
                if( el.style[t] !== undefined ){
                    return transitions[t];
                }
            }
        }
    }
}
</script>