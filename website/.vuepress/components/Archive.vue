<template>
    <div class="archivepage">
        <div class="hl">
            <div class="desc">Earthdate</div>
            <div class="year">{{earthYear}}</div>
        </div>
        <ArchiveNav 
            :prev="$page.frontmatter.prevYear"
            :next="$page.frontmatter.nextYear"
        />
        <section class="posts">
            <router-link v-for="post in posts" :to="post.path">
                <article ref="postbox">
                    <div class="info">
                        <div>{{post.title}}</div>
                        <div>07 Dec</div>
                    </div>
                    <ProgressivePanel class="background" :base64="post.thumbnail.preSrc" :imgsrc="post.thumbnail.src" :observeIntersect="true" />
                </article>
            </router-link>
        </section>
        <ArchiveNav 
            :prev="$page.frontmatter.prevYear"
            :next="$page.frontmatter.nextYear"
        />
        <div class="number">{{comicsTerm}}</div>
    </div>
</template>

<script>
import ArchiveNav from './Archive/ArchiveNav.vue'
import ProgressivePanel from './ProgressivePanel.vue'
import VanillaTilt from 'vanilla-tilt'
import debounce from 'debounce'

export default {
    props: ['year', 'postsSize', 'posts'],
    components: { ArchiveNav, ProgressivePanel },
    mounted() {
        VanillaTilt.init(this.$refs.postbox, {
            max: this.calcMax(),
            //scale: 1.03,
            perspective: 8000,
            glare: true,
            'max-glare': .75
        });
        window.addEventListener('resize', this.changeTiltSettings)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.changeTiltSettings)
        this.$refs.postbox.forEach(elem => {
            elem.vanillaTilt.destroy();
        });
    },
    methods: {
        changeTiltSettings: debounce(function() {
            this.$refs.postbox.forEach(elem => {
                elem.vanillaTilt.settings.max = this.calcMax()
                elem.vanillaTilt.reset()
            });
        }, 600),
        calcMax() {
            const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            return Math.max(10, -0.038*width + 40)
        }
    },
    computed: {
        comicsTerm() {
            return `${this.postsSize} Comic${this.postsSize>0?'s':''}`;
        },
        earthYear() {
            return (this.year+10000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
    }
}
</script>