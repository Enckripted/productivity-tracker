<script setup lang="ts">
import { ref, computed } from "vue"
import useSupabaseAuth from '@/composables/supabase/useSupabaseAuth'
import AuthLink from '@/components/auth/AuthLink.vue'
import router from "@/router"

const supabaseAuth = useSupabaseAuth()

const email = ref("")
const password = ref("")

const errorMsg = ref("")
const submitting = ref(false)

const buttonStyling = computed(() => [
	"w-35 px-5 py-1 mt-3 rounded-md text-lg text-white font-semibold whitespace-nowrap",
	submitting.value
		? "bg-gray-500 cursor-not-allowed"
		: "bg-green-600 hover:bg-green-500 cursor-pointer"
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
	<div class="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white px-4">
		<div class="flex flex-col w-full max-w-sm bg-zinc-900 rounded-lg shadow-lg p-6 gap-4">
			<h1 class="text-2xl text-center font-semibold mb-2">Welcome Back</h1>

			<form class="flex flex-col items-center gap-3" @submit.prevent="submitLoginForm">
				<div class="flex flex-col w-full">
					<input
						class="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400"
						type="email" v-model="email" placeholder="Email" />
				</div>

				<div class="flex flex-col w-full">
					<input
						class="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400"
						type="password" v-model="password" placeholder="Password" />
				</div>

				<button :class="buttonStyling" type="submit">
					{{ submitting ? "Signing in..." : "Sign In" }}
				</button>
			</form>

			<p v-if="errorMsg" class="text-red-500 text-center mt-2">{{ errorMsg }}</p>

			<div class="flex flex-col text-center text-sm text-gray-400 mt-3">
				<p>
					Don’t have an account?
					<AuthLink to="/signup">Sign up</AuthLink>
				</p>
				<p>
					Forgot your password?
					<AuthLink to="/forgotpassword">Reset it</AuthLink>
				</p>
			</div>
		</div>
	</div>
</template>
