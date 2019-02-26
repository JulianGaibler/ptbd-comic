import Vue from 'vue'
import nprogress from 'nprogress'

export default {
    mounted () {
        // configure progress bar
        console.log('mount')
        nprogress.configure({ showSpinner: false })

        this.$router.beforeEach((to, from, next) => {
            console.log('go')
            if (to.path !== from.path && !Vue.component(to.name)) {
                nprogress.start()
            }
            next()
        })

        this.$router.afterEach(() => {
            console.log('end')
            nprogress.done()
        })
    }
}