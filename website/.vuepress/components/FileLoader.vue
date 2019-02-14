<template>
	<div class="panels">
        <img v-for="image in images" :src="image">
    </div>
</template>

<script>
const comic_regex = /^\.\/panel([0-9]*)\.(png|jpe?g)$/
const share_regex = /^\.\/share.(png|jpe?g)$/;

export default {
	props: ['files'],
    data: function () {
        return {
            images: [],
        }
    },
    mounted() {
    	let panels = [];
    	let share = null;
    	this.files.keys().forEach(key => {
    		if (comic_regex.test(key)) panels.push(this.files(key));
    		else if (share_regex.test(key)) share = this.files(key);
    	});
    	this.images = panels;
    	this.$emit('aquired', {panels,share});
    }
}
</script>