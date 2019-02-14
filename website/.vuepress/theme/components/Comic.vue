<template>
    <main class="comicpage" aria-labelledby="main-title">
        <h1>{{$page.frontmatter.title}}</h1>
        <p>{{$page.frontmatter.date}}</p>
        <Content/>
    </main>
</template>

<script>

export default {
    data: function () {
        return {
            images: [],
        }
    },
    created () {
        this.images.push("file-loader!../../../_comics/94/panel1.png");
    },
}
</script>