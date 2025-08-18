<script setup lang="ts">
import { computed } from 'vue';
import MainView from './MainView.vue';
import LandingView from './LandingView.vue';

import useSupabaseAuth from '@/composables/supabaseAuth';

const supabaseAuth = useSupabaseAuth()

const authenticated = computed(() => supabaseAuth.session.value)
</script>

<template>
  <component :is="authenticated ? MainView : LandingView"></component>
</template>
