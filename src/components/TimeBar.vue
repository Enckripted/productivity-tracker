<script setup lang="ts">
const props = defineProps({
	percentage: {
		type: Number,
		required: true
	},
	color: String
})
</script>

<template>
	<div class="h-7" :style="{
		width: props.percentage * 100 + `%`,
		backgroundColor: props.color
	}"></div>
</template>
