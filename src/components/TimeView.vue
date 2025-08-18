<script setup lang="ts">
import useHelperFunctions from '@/composables/helper';

import TimeBar from '@/components/TimeBar.vue';

const props = defineProps(["tasks", "workingTask", "workingStart"])
const { currentTime, secsBetweenDates } = useHelperFunctions()

function getTotalTime() {
	let time = 0
	for (let item of props.tasks) {
		time += item.secondsSpent
	}
	return time + (props.workingStart ? secsBetweenDates(currentTime(), props.workingStart) : 0)
}

function getTimeSpent(task) {
	return task.secondsSpent + (task.name == props.workingTask ? secsBetweenDates(currentTime(), props.workingStart) : 0)
}

function getTimeSpentAsPercent(task) {
	return getTimeSpent(task) / getTotalTime()
}

function formatTimeSpent(timeInSecs) {
	const secs = timeInSecs % 60
	const mins = Math.floor((timeInSecs - secs) / 60) % 60
	const hrs = Math.floor((timeInSecs - mins * 60 - secs) / 3600)

	let result = ""
	if (hrs > 0)
		result += `${hrs} ${hrs != 1 ? "hrs" : "hr"} `
	if (mins > 0)
		result += `${mins} ${mins != 1 ? "mins" : "min"} `
	result += `${secs} ${secs != 1 ? "secs" : "sec"}`
	return result
}
</script>

<template>
	<div class="flex flex-col w-full gap-2 items-start" v-for="task in props.tasks" :key="task.name">
		<div v-if="task.secondsSpent > 0 || workingTask == task.name" class="flex flex-col w-full gap-0.25 items-start">
			<TimeBar :color="task.color" :percentage="getTimeSpentAsPercent(task)" />
			<p class="text-sm italic" :key="task.secondsTracked">{{ task.name + " - " +
				formatTimeSpent(getTimeSpent(task)) }}</p>
		</div>
	</div>
</template>
