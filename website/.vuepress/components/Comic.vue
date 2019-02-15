<template>
	<div>
        <slot />   
    </div>
</template>

<script>

export default {
	props: ['info', 'panels', 'share'],
}
</script>