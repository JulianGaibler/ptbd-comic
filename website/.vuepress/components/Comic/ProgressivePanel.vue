<template>
    <figure>
        <img :src="base64" />
        <img />
        <noscript>
            <img :src="imgsrc">
        </noscript>
    </figure>
</template>

<script>

// filter: blur(50px);
// var image = document.images[0];
// var downloadingImage = new Image();
// downloadingImage.onload = function(){
//     image.src = this.src;   
// };
// downloadingImage.src = "http://an.image/to/aynchrounously/download.jpg";

export default {
	name: 'ProgressivePanel',
    props: ['base64', 'imgsrc'],
}
</script>