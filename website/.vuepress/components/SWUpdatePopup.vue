<template>
  <SWUpdatePopup>
    <div slot-scope="{ reload }" class="page-update">
      <p>This website has been updated. Reload to see what's new!</p>
      <button class="ptbd-button" @click="reload">Reload Page</button>
    </div>
  </SWUpdatePopup>
</template>

<script>
import SWUpdatePopup from '@vuepress/plugin-pwa/lib/SWUpdatePopup.vue'

export default {
  components: { SWUpdatePopup }
}
</script>