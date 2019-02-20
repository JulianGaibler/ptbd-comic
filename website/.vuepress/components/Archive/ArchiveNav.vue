<template>
    <nav class="horizonalnav">
        <Link :class="{'button':true, 'inactive': !prev}" :to="prev">
            <Vector :src="require('../../referenced/icon_arrow_back.svg')" />
        </Link>
        <Link :class="{'button':true, 'inactive': !next}" :to="next">
            <Vector :src="require('../../referenced/icon_arrow_forward.svg')" />
        </Link>
    </nav>
</template>

<script>
import Link from '../../theme/components/Link'
import Vector from '../Vector'

export default {
    name: 'ArchiveNav',
    props: ['prev', 'next'],
    data() {
        return {

        }
    },
    components: { Vector, Link }
}
</script>