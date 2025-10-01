<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
	<RouterView />
</template>

<style>
@reference "tailwindcss";

@layer base {
	body {
		background-color: var(--color-zinc-950);
		color: var(--color-white);
	}
}

/* https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}


/* Firefox */
input[type=number] {
	-moz-appearance: textfield;
}
</style>
