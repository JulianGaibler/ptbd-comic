<template>
    <footer class="markbox top">
        <div class="left"><img :src="$withBase('/julianwels.svg')"></div>
        <div class="right">
            <Link to="//jwels.berlin/info/impressum.html">Legal & Privacy</Link>
        </div>
    </footer>
</template>

<script>
import Link from '../components/Link.vue'

export default {
    components: { Link },
}
</script>