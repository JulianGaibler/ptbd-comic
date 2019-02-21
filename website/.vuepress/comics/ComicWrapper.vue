<template>
    <Comic :info="info" :panels="panels" :share="share">|§|html|§|</Comic>
</template>

<script>
const info = |§|info|§|;
const thumbnail = |§|thumbnail|§|;
const panels = |§|panels|§|;
const share = |§|share|§|;

export default {
    data: function () {
        return {
           info, panels, share
        }
    },
    created() {
        // Evil hack until https://github.com/vuejs/vuepress/issues/79 gets resolved
        if (this.$ssrContext) {
            const regex = /https:\/\/ptbd\.jwels\.berlin\/default-banner\.png/g
            this.$ssrContext.pageMeta = this.$ssrContext.pageMeta.replace(regex, ($site.themeConfig.domain || '') + thumbnail.src)
        }
    },
}
</script>