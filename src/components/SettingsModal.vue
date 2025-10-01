<script setup lang="ts">
import { computed, ref } from 'vue'
import useSupabaseAuth from '@/composables/supabase/useSupabaseAuth'
import useApp from '@/composables/useApp'
import BaseModal from '@/components/base/BaseModal.vue'
import ConfirmDangerousModal from './base/ConfirmDangerousModal.vue'

const { session, logout } = useSupabaseAuth()
const app = useApp()
const active = defineModel<boolean>('active')

const confirmationOpen = ref(false)

const userEmail = computed(() => {
	return session.value ? session.value.user.email : "error occured while fetching email"
})

function openWipeModal() {
	confirmationOpen.value = true
}

function cancelWipeModal() {
	active.value = true
}

async function submitWipeModal() {
	active.value = false
	await app.wipeData()
	location.reload()
}

function handleLogout() {
	logout()
	active.value = false
}

function handleWipeData() {
	openWipeModal()
	active.value = false
}
</script>

<template>
	<BaseModal v-model:active="active" title="Settings" buttonText="Close" buttonColor="bg-blue-600 hover:bg-blue-500">
		<div class="flex flex-col gap-4">
			<div class="flex flex-col items-center">
				<span class="text-sm text-gray-400">Logged in as:</span>
				<span class="font-semibold text-lg">{{ userEmail }}</span>
			</div>

			<div class="flex flex-col gap-2 mt-4">
				<button class="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 cursor-pointer transition"
					@click="handleLogout">
					Log Out
				</button>
				<button class="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 cursor-pointer transition"
					@click="handleWipeData">
					Wipe Data
				</button>
			</div>
		</div>
	</BaseModal>

	<ConfirmDangerousModal
		description="This will delete all data in your account, and cannot be undone. Are you sure you want to do this?"
		button-title="Wipe Data" v-model:active="confirmationOpen" @cancel="cancelWipeModal"
		@submit="submitWipeModal" />
</template>
