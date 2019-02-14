<template>
  <div class="body-wrapper">
    <Banner class="markbox bottom" />
    <Comic v-if="is.comic" />
    <Archive v-else-if="is.archive" />
    <main v-else><Content /></main>
    <footer class="markbox top">
        <div class="left"><img :src="$withBase('/julianwels.svg')"></div>
        <div class="right"><a href="//jwels.berlin/info/impressum.html">Legal & Privacy</a></div>
    </footer>
  </div>
</template>

<script>
const comicsDir = "_comics"
import Comic from '../components/Comic.vue'
import Archive from '../components/Archive.vue'
import Banner from '../components/Banner.vue'

export default {
    components: { Comic, Archive, Banner },
    computed: {
        is () {
            return {
                comic: this.$page.frontmatter.type === 'comic',
                archive: this.$page.frontmatter.type === 'archive',
            }
        },
    }
}
</script>