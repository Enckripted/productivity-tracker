<script setup lang="ts">
import AuthLink from '@/components/auth/AuthLink.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { ref } from 'vue'

const showSignupModal = ref(false)
const showLoginModal = ref(false)
</script>

<template>
	<div class="flex flex-col w-3xl mx-auto pt-10 gap-10">
		<!-- Hero Section -->
		<div class="flex flex-col w-full items-center text-center gap-5 mt-10">
			<h2 class="text-4xl font-semibold">Build better habits through repetition.</h2>
			<p class="text-lg text-gray-300 max-w-2xl">
				Set goals, track time, and build good habits to be more productive and spend more time doing the things
				you enjoy.
			</p>
			<div class="flex gap-2">
				<AuthLink to="/login">
					<button
						class="px-4 py-1.5 mt-4 text-lg bg-green-600 text-white rounded-lg font-bold cursor-pointer hover:bg-green-500 transition">
						Get Started
					</button>
				</AuthLink>
			</div>
		</div>
	</div>

	<!-- Modals (placeholder for login/signup) -->
	<BaseModal v-model:active="showLoginModal" title="Login" button-text="Login" button-color="bg-blue-500">
		<div class="flex flex-col gap-2">
			<input class="p-2 bg-zinc-800 rounded-md" type="email" placeholder="Email" />
			<input class="p-2 bg-zinc-800 rounded-md" type="password" placeholder="Password" />
		</div>
	</BaseModal>

	<BaseModal v-model:active="showSignupModal" title="Sign Up" button-text="Create Account"
		button-color="bg-green-600 hover:bg-green-500">
		<div class="flex flex-col gap-2">
			<input class="p-2 bg-zinc-800 rounded-md" type="email" placeholder="Email" />
			<input class="p-2 bg-zinc-800 rounded-md" type="password" placeholder="Password" />
			<input class="p-2 bg-zinc-800 rounded-md" type="password" placeholder="Confirm Password" />
		</div>
	</BaseModal>
</template>
