<script setup lang="ts">
import { ref, computed } from "vue"
import useSupabaseAuth from '@/composables/supabase/useSupabaseAuth';

import AuthLink from '@/components/auth/AuthLink.vue';
import router from "@/router";

const supabaseAuth = useSupabaseAuth()

const email = ref("")
const password = ref("")

const errorMsg = ref("")
const submitting = ref(false)

const buttonStyling = computed(() => [
	"mt-2 p-0.5 px-3 text-black rounded-xs cursor-pointer",
	submitting.value ? "bg-gray-200" : "bg-white"
])

async function submitLoginForm() {
	submitting.value = true
	const { error } = await supabaseAuth.login(email.value, password.value)

	if (error) {
		errorMsg.value = error.message
	} else {
		router.push("/")
	}
	submitting.value = false
}
</script>

<template>
	<div class="flex flex-col w-sm h-screen mx-auto justify-center gap-2">
		<h1 class="text-4xl font-bold">Login</h1>

		<form class="flex flex-col gap-0.5 items-start">
			<div class="flex flex-col w-full">
				<label>Email:</label>
				<input class="w-full border-1 border-white rounded-xs" type="text" v-model="email" />
			</div>
			<div class="flex flex-col w-full">
				<label>Password: </label>
				<input class="w-full border-1 border-white rounded-xs" type="password" v-model="password" />
			</div>
			<button :class="buttonStyling" @click.prevent="submitLoginForm">Login</button>
		</form>

		<p v-if="errorMsg" class="text-red-600">{{ errorMsg }}</p>

		<div class="flex flex-col">
			<div>
				<span>Don't have an account? </span>
				<AuthLink to="/signup">Click here to sign up.</AuthLink>
			</div>
			<div>
				<span>Forgot your password? </span>
				<AuthLink to="/forgotpassword">Click here to reset it.</AuthLink>
			</div>
		</div>
	</div>
</template>
