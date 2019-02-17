<template>
    <span class="vector" v-once v-html="src" />
</template>

<script>
export default {
    props: [ 'src' ]
}
</script>