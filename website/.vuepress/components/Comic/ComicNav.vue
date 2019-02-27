<template>
    <nav class="horizonalnav">
        <Link :class="{'ptbd-button':true, 'inactive': !prev}" :aria-disabled="!prev" :to="prev"  aria-label="Previous Comic">
            <Vector :src="require('../../referenced/icon_arrow_back.svg')" />
        </Link>

        <Link v-if="noSharebox" class="ptbd-button" :to="$withBase(share)" download target="_blank" rel="noopener noreferrer" aria-label="Download as Image">
            <Vector :src="require('../../referenced/icon_share.svg')" />
        </Link>
        <div v-else class="ptbd-button" @click="openShare" role="button" aria-label="Share Dialog">
            <Vector :src="require('../../referenced/icon_share.svg')" />
        </div>

        <Link :class="{'ptbd-button':true, 'inactive': !next}" :aria-disabled="!next" :to="next" aria-label="Next Comic">
            <Vector :src="require('../../referenced/icon_arrow_forward.svg')" />
        </Link>

        <Share v-if="openShareBox" :comicInfo="comicInfo" @close="toggleModal(false)" />
    </nav>
</template>

<script>
import Link from '../../theme/components/Link'
import Vector from '../Vector'
import Share from './Share'

export default {
    name: 'ComicNav',
    props: ['prev', 'next', 'share'],
    data() {
        return {
            noSharebox: true,
            openShareBox: false,
        }
    },
    components: { Vector, Link, Share },
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
                this.toggleModal(true)
            }
        },
        toggleModal(b) {
            this.openShareBox = b;
        }
    },
    computed: {
        comicInfo() {
            return {
                title: `${this.$page.title} | ${this.$site.title}`,
                url: (this.$site.themeConfig.domain || '') + this.$page.path,
                share: this.share,
            }
        }
    }
}
</script>