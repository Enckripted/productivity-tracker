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
</style>
