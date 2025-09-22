<script setup lang="ts">
import useSupabaseAuth from '@/composables/supabase/useSupabaseAuth';
import router from '@/router';

const supabaseAuth = useSupabaseAuth()

async function logout() {
	await supabaseAuth.logout()
	router.push("/login")
}
</script>

<template>
	<button @click="logout">Logout</button>
</template>
