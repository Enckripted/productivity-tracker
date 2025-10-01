<script setup lang="ts">
import { ref, computed, watch } from "vue"
import useSupabaseAuth from '@/composables/supabase/useSupabaseAuth'
import AuthLink from '@/components/auth/AuthLink.vue'

const supabaseAuth = useSupabaseAuth()

const email = ref("")
const password = ref("")

const errorMsg = ref("")
const success = ref(false)
const submitting = ref(false)

const buttonStyling = computed(() => [
	"w-35 px-5 py-1 mt-3 rounded-md text-center text-lg text-white font-semibold whitespace-nowrap",
	submitting.value
		? "bg-gray-500 cursor-not-allowed"
		: "bg-green-600 hover:bg-green-500 cursor-pointer"
])

async function submitSignupForm() {
	submitting.value = true
	success.value = false
	errorMsg.value = ""

	const { error } = await supabaseAuth.signup(email.value, password.value)
	if (error) {
		errorMsg.value = error.message
	} else {
		success.value = true
	}

	submitting.value = false
}

watch(supabaseAuth.session, () => {
	if (supabaseAuth.session)
		location.reload()
})
</script>

<template>
	<div class="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white px-4">
		<div class="flex flex-col w-full max-w-sm bg-zinc-900 rounded-lg shadow-lg p-6 gap-4">
			<h1 class="text-2xl font-semibold text-center mb-2">Create an account</h1>

			<form class="flex flex-col items-center gap-3" @submit.prevent="submitSignupForm">
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
					{{ submitting ? "Signing Up..." : "Sign Up" }}
				</button>
			</form>

			<p v-if="success" class="text-green-500 text-center mt-2">
				Account created successfully! Please check your email to verify your account.
			</p>

			<p v-else-if="errorMsg" class="text-red-500 text-center mt-2">
				{{ errorMsg }}
			</p>

			<div class="flex flex-col text-center text-sm text-gray-400 mt-3">
				<p>
					Already have an account?
					<AuthLink to="/login">Log in</AuthLink>
				</p>
			</div>
		</div>
	</div>
</template>
