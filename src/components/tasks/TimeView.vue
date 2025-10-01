<script setup lang="ts">
import useHelperFunctions from '@/composables/useHelper';

import TimeBar from '@/components/tasks/TimeBar.vue';
import { computed, onMounted } from 'vue';
import useTasks from '@/composables/useTasks';
import useModals from '@/composables/useModals';

const props = defineProps<{
	useTimeToday: boolean
}>()
const app = useTasks()
const { taskEditModal, taskDeleteModal } = useModals()
const { now, datesOnSameDay, secsBetweenDates, formatTimeSpent } = useHelperFunctions()

function getTimeSpentAsPercent(time: number) {
	return time / totalTime.value
}

const taskList = computed(() => {
	return app.taskList.value.map((task) => ({
		id: task.id,
		name: task.name,
		color: task.color, //check if working task is being updated to prevent flashing of incorrect time
		timeWorked: (props.useTimeToday ? task.secondsWorkedToday : task.secondsWorked) +
			(app.workingTask.value === task.id && !app.updatingWorkingTask.value ? secsBetweenDates(now.value, app.workingStart.value) : 0),
	})).filter((task) => task.timeWorked !== 0 || task.id === app.workingTask.value).sort((a, b) => b.timeWorked - a.timeWorked) //sort in reverse order
})

const totalTime = computed(() => {
	let time = 0
	for (const task of taskList.value) {
		time += task.timeWorked
	}
	return time
})

onMounted(() => {
	setInterval(() => {
		if (app.dayRunning && !datesOnSameDay(now.value, app.dayStart.value))
			app.endWorkday() //no need to await this
	}, 1000)
})

</script>

<template>
	<div v-if="totalTime > 0" class="flex flex-col w-full gap-5">
		<div class="flex flex-col w-full gap-2 items-start" v-for="task of taskList" :key="task.id">
			<div v-if="useTimeToday || task.timeWorked > 0 || app.workingTask.value == task.id"
				class="flex flex-col w-full gap-0.25 items-start">
				<TimeBar :color="task.color" :percentage="getTimeSpentAsPercent(task.timeWorked)" />

				<div class="flex w-full justify-between">
					<span class="text-sm italic">{{ task.name + " - " + formatTimeSpent(task.timeWorked) }}</span>
					<div v-if="task.name !== 'Idling'" class="flex gap-1">
						<span class="text-blue-300 text-sm italic underline cursor-pointer"
							@click="() => taskEditModal.open(task.id)">Edit</span>
						<span class="text-sm">-</span>
						<span class="text-red-400 text-sm italic underline cursor-pointer"
							@click="() => taskDeleteModal.open(task.id)">Delete</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div v-else class="flex w-full justify-center">
		<p class="mt-5 italic">No tasks worked yet!</p>
	</div>
</template>
