<template>
  <div class="body-wrapper">
    <Banner class="markbox bottom" />
    <main>
    	<div class="err404">
    		<h1>Page not found</h1>
	        <img :src="require('../../referenced/wrongdoor.svg')">
	    </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Banner from '../components/Banner.vue'
import Footer from '../components/Footer.vue'

export default {
    components: { Banner, Footer },
}
</script>