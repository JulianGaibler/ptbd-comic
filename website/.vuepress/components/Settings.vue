<template>
    <section class="settings">
        <noscript>This feature only works with javascript. Sorry :(</noscript>
        <ClientOnly>
            <label v-for="option in options"><input type="radio" :value="option.name" v-model="picked"><span>{{option.label}}</span></label>
        </ClientOnly>
    </section>
</template>

<script>
export default {
    name: 'Settings',
    props: ['type', 'options', 'default', 'afterUpdate'],
    data: function () {
        return {
           picked: this.$ssrContext ? this.default : (localStorage[`user_${this.type}`] || this.default)
        }
    },
    watch: {
        picked(val, oldVal) {
            localStorage[`user_${this.type}`] = this.picked;
            window[this.afterUpdate]();
        }
    }
}
</script>