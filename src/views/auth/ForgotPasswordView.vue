<script setup lang="ts">
import { ref, computed } from "vue"
import useSupabaseAuth from '@/composables/supabase/useSupabaseAuth'
import AuthLink from '@/components/auth/AuthLink.vue'

const supabaseAuth = useSupabaseAuth()

const email = ref("")
const errorMsg = ref("")
const success = ref(false)
const submitting = ref(false)

const buttonStyling = computed(() => [
	"w-45 px-5 py-1 mt-3 rounded-md text-lg text-white font-semibold whitespace-nowrap",
	submitting.value
		? "bg-gray-500 cursor-not-allowed"
		: "bg-green-600 hover:bg-green-500 cursor-pointer"
])

async function submitResetForm() {
	submitting.value = true
	const { error } = await supabaseAuth.forgotPassword(email.value)

	if (error) {
		errorMsg.value = error.message
		success.value = false
	} else {
		success.value = true
		errorMsg.value = ""
	}

	submitting.value = false
}
</script>

<template>
	<div class="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white px-4">
		<div class="flex flex-col w-full max-w-sm bg-zinc-900 rounded-lg shadow-lg p-6 gap-4">
			<h1 class="text-2xl font-semibold text-center mb-2">Forgot Password</h1>

			<form class="flex flex-col items-center gap-3" @submit.prevent="submitResetForm">
				<div class="flex flex-col w-full">
					<input
						class="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400"
						type="email" v-model="email" placeholder="Email" />
				</div>

				<button :class="buttonStyling" type="submit">
					{{ submitting ? "Sending..." : "Send Reset Link" }}
				</button>
			</form>

			<p v-if="success" class="text-green-500 text-center mt-2">
				A password reset email has been sent to your inbox.
			</p>
			<p v-else-if="errorMsg" class="text-red-500 text-center mt-2">
				{{ errorMsg }}
			</p>

			<div class="flex justify-center text-sm text-gray-400 mt-3">
				<p>
					Remember your password?
					<AuthLink to="/login">Log in</AuthLink>
				</p>
			</div>
		</div>
	</div>
</template>
