<script setup lang="ts">
import { computed, ref } from 'vue';
import useApp from '@/composables/useApp';
import useHelperFunctions from '@/composables/useHelper';

const emit = defineEmits(["submit"])
const app = useApp()
const { secsWorkedSince } = useHelperFunctions()

const selectedTask = ref("")

const newName = ref("")
const newColor = ref("")

function submitModal() {
	if (selectedTask.value === "(create task)") {
		if (newName.value === "(create task)" || !newName.value || app.taskExists(newName.value)) {
			return
		} else {
			emit("submit", selectedTask.value, newName.value, newColor.value)
		}
	} else {
		emit("submit", selectedTask.value, "", "")
	}
}

const taskList = computed(() => {
	const workingSecs = secsWorkedSince(app.workingStart.value)
	return app.tasks.value.slice().sort((a, b) => (b.secondsWorked + (b.id === app.workingTask.value ? workingSecs : 0)) - (a.secondsWorked + (a.id === app.workingTask.value ? workingSecs : 0)))
})
</script>

<template>
	<Teleport to="body">
		<div class="flex fixed inset-0 w-full h-full bg-black opacity-25"></div>
		<div class="flex fixed inset-0 items-center justify-center z-10">
			<div class="flex flex-col w-90 max-h py-10 gap-4 bg-zinc-800">
				<div class="flex flex-col gap-1 items-center">
					<h3 class="text-xl font-bold">Set Current Task</h3>
					<select class="bg-zinc-800 p-1 border-b-2" v-model="selectedTask">
						<option :value="task.name" v-for="task of taskList" :key="task.name">{{ task.name }}
						</option>
						<option value="(create task)">(create task)</option>
					</select>
				</div>
				<div v-if="selectedTask == `(create task)`">
					<form class="flex flex-row gap-1 justify-center">
						<input class="w-40 h-7 p-1 border-1" type="text" v-model="newName" />
						<input class="w-10 h-7 border-0" type="color" v-model="newColor" />
					</form>
				</div>
				<div class="text-center">
					<button class="px-2 py-1 rounded-md bg-blue-500 border border-transparent cursor-pointer"
						@click="submitModal">Set Task</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
