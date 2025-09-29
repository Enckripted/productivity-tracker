<script setup lang="ts">
const props = defineProps<{
	title: string,
	buttonText: string,
	buttonColor: string,

}>()
const active = defineModel<boolean>("active")
const emit = defineEmits(["reset", "submit"])

function hideModal() {
	active.value = false
	emit("reset")
}

function submitModal() {
	emit("submit")
	hideModal()
}
</script>

<template>
	<Teleport to="body">
		<div v-if="active" class="flex fixed inset-0 w-full h-full bg-black opacity-25"></div>
		<div v-if="active" class="flex fixed inset-0 items-center justify-center z-10">
			<div class="flex flex-col w-90 max-h p-5 gap-4 bg-zinc-900 rounded-sm">
				<h3 class="w-full text-center text-2xl font-semibold">{{ props.title }}</h3>
				<slot></slot>
				<div class="flex w-full gap-1 justify-end">
					<button class="w-20 p-1 bg-gray-500 rounded-md cursor-pointer" @click="hideModal">Cancel</button>
					<button :class="props.buttonColor" class="w-20 p-1 rounded-md cursor-pointer"
						@click="submitModal">{{
							props.buttonText }}</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
