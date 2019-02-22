<template>
    <nav class="horizonalnav">
        <Link :class="{'button':true, 'inactive': !prev}" :to="prev">
            <Vector :src="require('../../referenced/icon_arrow_back.svg')" />
        </Link>

        <Link v-if="noSharebox" class="button" :to="share" download target="_blank" rel="noopener noreferrer">
            <Vector :src="require('../../referenced/icon_share.svg')" />
        </Link>
        <div v-else class="button" @click="openShare">
            <Vector :src="require('../../referenced/icon_share.svg')" />
        </div>


        <Link :class="{'button':true, 'inactive': !next}" :to="next">
            <Vector :src="require('../../referenced/icon_arrow_forward.svg')" />
        </Link>
    </nav>
</template>

<script>
import Link from '../../theme/components/Link'
import Vector from '../Vector'

export default {
    name: 'ComicNav',
    props: ['prev', 'next', 'share'],
    data() {
        return {
            noSharebox: true
        }
    },
    components: { Vector, Link },
    mounted() {
        this.noSharebox = false;
    },
    methods: {
        openShare() {
            if (navigator.share) {
                navigator.share({
                    title: this.comicInfo.title,
                    url: this.comicInfo.url,
                })
            } else {
                
            }
        },
    },
    computed: {
        comicInfo() {
            return {
                title: `${this.$page.title} | ${this.$site.title}`,
                url: (this.$site.themeConfig.domain || '') + this.$page.path
            }
        }
    }
}
</script>