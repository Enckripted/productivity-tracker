<script setup lang="ts">
const props = defineProps<{
	title: string,
	buttonText: string,
	buttonColor: string,

}>()
const active = defineModel<boolean>("active")
const emit = defineEmits(["cancel", "submit"])

function hideModal() {
	active.value = false
}

function cancelModal() {
	emit("cancel")
	hideModal()
}

function submitModal() {
	emit("submit")
	hideModal()
}
</script>

<template>
	<!--TODO: find out why this flickers-->
	<Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200 ease-out"
		leave-to-class="opacity-0" leave-active-class="transition-opacity duration-200 ease-in">
		<div v-if="active" class="flex fixed inset-0 w-full h-full bg-black opacity-50"></div>
	</Transition>

	<Transition enter-from-class="opacity-0 scale-95" enter-active-class="transition-all duration-200 ease-out"
		leave-to-class="opacity-0 scale-95" leave-active-class="transition-all duration-150 ease-in">
		<div v-if="active" class="flex fixed inset-0 items-center justify-center z-10">
			<div class="flex flex-col w-90 max-h p-5 gap-4 bg-zinc-900 rounded-sm">
				<h3 class="w-full text-center text-2xl font-semibold">{{ props.title }}</h3>
				<slot></slot>
				<div class="flex w-full gap-1 justify-end">
					<button class="w-20 p-1 bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
						@click="cancelModal">Cancel</button>
					<button :class="props.buttonColor" class="w-20 p-1 rounded-md cursor-pointer"
						@click="submitModal">{{
							props.buttonText }}</button>
				</div>
			</div>
		</div>
	</Transition>

</template>
