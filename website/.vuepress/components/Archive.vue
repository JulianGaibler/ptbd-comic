<template>
	<div>
        <h1>{{year}}</h1>
        <ul>
        	<li v-for="post in posts">{{post.title}}</li>
        </ul>
    </div>
</template>

<script>

export default {
	props: ['year', 'postsSize', 'posts'],
}
</script>