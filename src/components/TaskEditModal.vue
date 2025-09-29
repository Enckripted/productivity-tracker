<script setup lang="ts">
import { ref, watch } from 'vue';
import useApp from '@/composables/useApp';
import useModals from '@/composables/useModals';

import BaseModal from './base/BaseModal.vue';
import TimeBar from './TimeBar.vue';

const app = useApp()
const { editId, editActive } = useModals()

const taskName = ref("")
const taskColor = ref("")

function onIdChange(newId: number) {
	console.log(editActive.value)
	const task = app.tasks.findTaskWithId(newId)
	taskName.value = task.name
	taskColor.value = task.color
}

function modalSubmit() {
	app.tasks.editTask(editId.value, taskName.value, taskColor.value)
}

watch(editId, onIdChange)
</script>

<template>
	<BaseModal title="Edit Task" button-text="Edit" button-color="bg-green-500" v-model:active="editActive"
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
				<TimeBar :percentage="100" :color="taskColor" />
			</div>
			<p class="text-sm italic">{{ taskName }} - 2 hours 2 minutes 2 seconds</p>
		</div>
	</BaseModal>
</template>
