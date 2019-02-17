<template>
	<span v-if="!to"><slot /></span>
    <a v-else-if="to.substring(0, 2) == '//'" target="_blank" rel="noopener noreferrer" :href="to"><slot /></a>
    <router-link v-else :to="to"><slot /></router-link>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
        }
    }
}
</script>