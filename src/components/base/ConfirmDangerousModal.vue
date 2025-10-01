<!--mostly ai generated -->
<script setup lang="ts">
const props = defineProps<{
	description: string
	buttonTitle: string
}>()

const active = defineModel<boolean>('active')
const emit = defineEmits(["cancel", 'submit'])

function closeModal() {
	active.value = false
}

function cancelAction() {
	emit("cancel")
	closeModal()
}

function confirmAction() {
	emit('submit')
	closeModal()
}
</script>

<template>
	<Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200 ease-out"
		leave-to-class="opacity-0" leave-active-class="transition-opacity duration-200 ease-in">
		<div v-if="active" class="flex fixed inset-0 w-full h-full bg-black opacity-50"></div>
	</Transition>
	<Transition enter-from-class="opacity-0 scale-95" enter-active-class="transition-all duration-200 ease-out"
		leave-to-class="opacity-0 scale-95" leave-active-class="transition-all duration-150 ease-in">
		<div v-if="active" class="fixed inset-0 z-50 flex items-center justify-center">
			<div
				class="bg-zinc-900 rounded-md p-6 w-[90%] max-w-md shadow-lg border border-zinc-800 flex flex-col gap-4">
				<p class="leading-relaxed">
					{{ props.description }}
				</p>

				<div class="flex justify-end gap-2">
					<button class="w-25 py-1 rounded-md bg-gray-600 hover:bg-gray-500 transition cursor-pointer"
						@click="cancelAction">
						Cancel
					</button>
					<button class="w-25 py-1 rounded-md bg-red-600 hover:bg-red-700 transition cursor-pointer"
						@click="confirmAction">
						{{ props.buttonTitle }}
					</button>
				</div>
			</div>
		</div>
	</Transition>
</template>
