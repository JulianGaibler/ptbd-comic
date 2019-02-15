<template>
    <Archive :year="year" :postsSize="postsSize" :posts="posts" />
</template>

<script>
const year = |§|year|§|;
const postsSize = |§|posts_size|§|;
const posts = |§|posts|§|;

export default {
    data: function () {
        return {
           year, postsSize, posts
        }
    },
}
</script>