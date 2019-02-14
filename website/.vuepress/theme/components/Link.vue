<template>
    <a v-if="to.substring(0, 2) == '//'" :href="to"><slot /></a>
    <router-link v-else :to="to"><slot /></router-link>
</template>

<script>
export default {
    props: {
        to: {
            type: String,
            required: true
        }
    }
}
</script>