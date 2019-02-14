<template>
    <header>
        <div class="inline">
            <div class="avatar"><img src="/emily.svg"></div>
            <div class="logo"><router-link to="/"><img :src="$withBase('/ptbdlogo.svg')"></router-link></div>
        </div>
        <nav>
            <ul>
                <li v-for="item in $themeConfig.primary"><Link :to="item.link">{{item.label}}</Link></li>
            </ul>
            <ul>
                <li v-for="item in $themeConfig.secondary"><Link :to="item.link">{{item.label}}</Link></li>
            </ul>
        </nav>
    </header>
</template>

<script>
import Link from '../components/Link.vue'
export default {
    components: { Link },
    data: function () {
        return {
            images: [],
        }
    }
}
</script>