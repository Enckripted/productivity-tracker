<script setup lang="ts">
import { ref } from 'vue';
import useTasks from '@/composables/useTasks';

import TimeView from '@/components/TimeView.vue';

const app = useTasks()

const selectedView = ref(0)

function handleWorkdayButton() {
	if (app.dayRunning.value)
		app.endWorkday()
	else
		app.startWorkday()
}
</script>

<template>
	<div class="flex w-full justify-start text-lg">
		<button :class="selectedView === 0 ? 'bg-green-500' : 'bg-transparent'"
			class="w-20 p-0.5 rounded-md cursor-pointer" @click="selectedView = 0">
			Daily
		</button>
		<button :class="selectedView === 1 ? 'bg-green-500' : 'bg-transparent'"
			class="w-20 p-0.5 rounded-md cursor-pointer" @click="selectedView = 1">
			Overall
		</button>
	</div>

	<div class="flex flex-col w-full gap-5" v-if="selectedView == 0">
		<TimeView :use-time-today="true" />
		<button :class="!app.dayRunning.value ? 'bg-green-500' : 'bg-red-500'"
			class="w-40 p-0.5 mt-2 mx-auto text-lg bg-green-500 rounded-sm cursor-pointer"
			@click="handleWorkdayButton">{{
				!app.dayRunning.value ? "Start Workday" :
					"End Workday" }}</button>
	</div>
	<div class="flex flex-col w-full gap-5" v-if="selectedView == 1">
		<TimeView :use-time-today="false" />
	</div>
</template>
