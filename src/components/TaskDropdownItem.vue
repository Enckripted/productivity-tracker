<script setup lang="ts">
const props = defineProps<{
	name: string,
	color: string
}>()
</script>

<template>
	<div class="flex w-max">
		<div class="flex w-full">
			<div class="flex w-10 h-full items-center justify-center">
				<div :style="{ backgroundColor: props.color }" class="w-2.5 h-2.5 rounded-4xl"></div>
			</div>
			<p>{{ props.name }}</p>
		</div>
	</div>
</template>
