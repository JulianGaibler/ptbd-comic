<template>
    <div class="nav">
        <Link :class="{'button':true, 'inactive': !$page.frontmatter.prevComic}" :to="$page.frontmatter.prevComic">
            <Vector :src="require('../../referenced/icon_arrow_back.svg')" />
        </Link>
        <div class="button">
            <Vector :src="require('../../referenced/icon_share.svg')" />
        </div>
        <Link :class="{'button':true, 'inactive': !$page.frontmatter.nextComic}" :to="$page.frontmatter.nextComic">
            <Vector :src="require('../../referenced/icon_arrow_forward.svg')" />
        </Link>
    </div>
</template>

<script>
import Link from '../../theme/components/Link'
import Vector from './Vector'

export default {
    name: 'ProgressivePanel',
    props: ['prev', 'next', 'share'],
    data() {
        return {

        }
    },
    components: { Vector, Link }
}
</script>