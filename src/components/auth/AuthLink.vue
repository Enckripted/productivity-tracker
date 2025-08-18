<script setup lang="ts">
const props = defineProps(["to"])
</script>

<template>
  <RouterLink class="text-blue-500 underline" :to="props.to">
    <slot></slot>
  </RouterLink>
</template>
