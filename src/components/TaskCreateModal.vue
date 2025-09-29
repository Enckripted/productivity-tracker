<script setup lang="ts">
import { computed, ref } from 'vue';
import useApp from '@/composables/useApp';
import BaseModal from './base/BaseModal.vue';
import TimeBar from './TimeBar.vue';

const app = useApp()

const active = defineModel<boolean>("active")

const taskName = ref("")
const taskColor = ref("")

const previewName = computed(() => {
	return taskName.value ? taskName.value : "<unnamed>"
})
const previewColor = computed(() => {
	return taskColor.value ? taskColor.value : "#008FFF"
})

function modalSubmit() {
	app.tasks.createTask(taskName.value, taskColor.value)
}
</script>

<template>
	<BaseModal title="Create Task" button-text="Create" button-color="bg-green-500" v-model:active="active"
		@submit="modalSubmit">
		<div class="flex flex-col w-full">
			<label class="italic mb-1">Name</label>
			<input class="border-b-2 border-b-white" type="text" v-model="taskName" />
		</div>
		<div class="flex flex-col w-full">
			<label class="italic mb-1">Color</label>
			<input class="w-full border-0" type="color" v-model="taskColor" />
		</div>
		<div class="flex flex-col w-full">
			<label class="italic mb-1">Preview</label>
			<div class="flex">
				<TimeBar :percentage="100" :color="previewColor" />
			</div>
			<p class="text-sm italic">{{ previewName }} - 2 hours 2 minutes 2 seconds</p>
		</div>
	</BaseModal>
</template>
