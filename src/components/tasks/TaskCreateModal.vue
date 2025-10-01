<script setup lang="ts">
import { computed, ref } from 'vue';
import useApp from '@/composables/useApp';
import BaseModal from '@/components/base/BaseModal.vue';
import TimeBar from './TimeBar.vue';

const app = useApp()

const active = defineModel<boolean>("active")
const emit = defineEmits(["close"])

const taskName = ref("")
const taskColor = ref("")

const errorMsg = ref("")

const previewName = computed(() => {
	return taskName.value ? taskName.value : "<unnamed>"
})
const previewColor = computed(() => {
	return taskColor.value ? taskColor.value : "#008FFF"
})

function closeModal() {
	emit("close")
}

function modalSubmit() {
	if (!taskName.value || !taskColor.value) {
		errorMsg.value = "Please fill out all fields"
		return
	}
	if (taskName.value.length > 32) {
		errorMsg.value = "Please type a shorter name"
		return
	}
	app.tasks.createTask(taskName.value, taskColor.value)
	closeModal()
}
</script>

<template>
	<BaseModal title="Create Task" button-text="Create" button-color="bg-green-600 hover:bg-green-700"
		v-model:active="active" @submit="modalSubmit" @cancel="closeModal">
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
			<p class="text-sm italic">{{ previewName }} - 20 hrs 20 mins 20 secs</p>
		</div>
		<p>{{ errorMsg }}</p>
	</BaseModal>
</template>
