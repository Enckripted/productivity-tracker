<script setup lang="ts">
import { computed, ref } from 'vue';
import useApp from '@/composables/useApp';
import TaskDropdownItem from './TaskDropdownItem.vue';

const app = useApp()

const dropdownActive = ref(false)

const selection = defineModel<number>({ default: -1 })

const searchQuery = ref("")

const selectedTask = computed(() => {
	//TODO: do this a better way
	if (selection.value === -1)
		return { id: -1, userId: -1, name: "Idling", color: "#008FFF", secondsWorked: 0, secondsWorkedToday: 0 }
	return app.tasks.findTaskWithId(selection.value)
})

const searchResults = computed(() => {
	return app.tasks.taskList.value.filter((task) => task.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

function openDropdown() {
	selection.value = app.tasks.workingTask.value
	dropdownActive.value = true
}

function closeDropdown() {
	dropdownActive.value = false
}

function toggleDropdown() {
	if (dropdownActive.value)
		closeDropdown()
	else
		openDropdown()
}

function selectFromDropdown(id: number) {
	selection.value = id
	closeDropdown()
}
</script>

<template>
	<div class="flex flex-col items-start w-full">
		<div class="flex w-full items-center justify-between p-1 bg-zinc-800 border-b border-b-white cursor-pointer"
			@click="toggleDropdown">
			<TaskDropdownItem :name="selectedTask.name" :color="selectedTask.color" />
			<div class="flex w-10 h-full items-center justify-center">
				<img src="@/assets/down.svg" alt="Dropdown" />
			</div>
		</div>
		<div class="flex flex-col w-full max-h-50 overflow-scroll overflow-x-hidden scrollbar-styling"
			v-if="dropdownActive">
			<input class="w-full px-5 py-1.5 border-b bg-zinc-800 border-b-zinc-700 outline-none" type="text"
				placeholder="Search for a task..." v-model="searchQuery" />
			<div class="w-full p-1.5 cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition-colors"
				v-for="task of searchResults" :key="task.id" @click="() => selectFromDropdown(task.id)">
				<TaskDropdownItem :name="task.name" :color="task.color" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.scrollbar-styling {
	scrollbar-width: thin;
	scrollbar-color: var(--color-neutral-600) var(--color-zinc-800);
}
</style>
