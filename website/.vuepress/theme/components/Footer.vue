<template>
    <footer class="markbox top">
        <Link class="left" to="//jwels.berlin/"><img :src="$withBase('/julianwels.svg')"></Link>
        <div class="right">
            <Link to="//jwels.berlin/imprint/">Legal & Privacy</Link>
        </div>
    </footer>
</template>

<script>
import Link from '../components/Link.vue'

export default {
    components: { Link },
}
</script>