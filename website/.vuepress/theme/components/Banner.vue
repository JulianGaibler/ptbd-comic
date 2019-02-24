<template>
    <header>
        <div class="inline">
            <div class="avatar"><img :src="$withBase('/emily.svg')" alt="Ptbd Emily"></div>
            <div class="logo"><router-link to="/">
                <img class="full" alt="Pretends to be Drawing" :src="$withBase('/ptbdlogo-full.svg')">
                <img class="mini" alt="Pretends to be Drawing" :src="$withBase('/ptbdlogo-mini.svg')">
            </router-link></div>
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
}
</script>