<script setup lang="ts">
import useHelperFunctions from '@/composables/useHelper';

import TimeBar from '@/components/TimeBar.vue';
import { computed, onMounted } from 'vue';
import useApp from '@/composables/useApp';

const props = defineProps<{
	useTimeToday: boolean
}>()
const app = useApp()
const { now, onSameDay, secsBetweenDates, formatTimeSpent } = useHelperFunctions()

function getTimeSpentAsPercent(time: number) {
	return time / totalTime.value
}

const taskList = computed(() => {
	return app.tasks.value.map((task) => ({
		id: task.id,
		name: task.name,
		color: task.color, //check if working task is being updated to prevent flashing of incorrect time
		timeWorked: (props.useTimeToday ? task.secondsWorkedToday : task.secondsWorked) +
			(app.workingTask.value === task.id && !app.updatingWorkingTask.value ? secsBetweenDates(now.value, app.workingStart.value) : 0),
	})).filter((task) => task.timeWorked !== 0).sort((a, b) => b.timeWorked - a.timeWorked) //sort in reverse order
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
		if (app.dayRunning && !onSameDay(now.value, app.dayStart.value))
			app.endWorkday() //no need to await this
	}, 1000)
})

</script>

<template>
	<div class="flex flex-col w-full gap-5" v-if="totalTime > 0">
		<div class="flex flex-col w-full gap-2 items-start" v-for="task of taskList" :key="task.id">
			<div v-if="task.timeWorked > 0 || app.workingTask.value == task.id"
				class="flex flex-col w-full gap-0.25 items-start">
				<TimeBar :color="task.color" :percentage="getTimeSpentAsPercent(task.timeWorked)" />
				<p class="text-sm italic">{{ task.name + " - " +
					formatTimeSpent(task.timeWorked) }}</p>
			</div>
		</div>
	</div>
	<div class="flex w-full justify-center" v-else>
		<p class="mt-5 italic">No tasks worked yet!</p>
	</div>
</template>
