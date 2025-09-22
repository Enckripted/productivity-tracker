import { ref } from 'vue'
import useTasks from './useTasks'
import useGoals from './useGoals'
import useSupabase from './supabase/useSupabase'
import useHelperFunctions from './useHelper'

const supabase = useSupabase()
const tasks = useTasks()
const goals = useGoals()
const { datesOnSameDay } = useHelperFunctions()

const lastUpdate = ref(new Date())

//supabase
async function getLastUpdate() {
	const { data, error } = await supabase.from('users').select('last_update').single()
	if (error) throw error
	return new Date(data.last_update)
}

async function setLastUpdate(time: Date) {
	const { data, error } = await supabase
		.from('users')
		.update({
			last_update: time.toISOString(),
		})
		.select('last_update')
		.single()
	if (error) throw error
	return new Date(data.last_update)
}

async function appStartEvent() {
	lastUpdate.value = await getLastUpdate()
	await tasks.loadInitialState()
	await goals.loadInitialState()

	await update()
}

async function dayChangeEvent() {
	if (goals.completedAllGoals()) await goals.incrementStreak()
	else await goals.clearStreak()
	await goals.clearGoalCompletions()

	if (tasks.dayRunning) await tasks.endWorkday()

	lastUpdate.value = await setLastUpdate(new Date())
}

async function update() {
	const now = new Date()

	if (goals.canCompleteGoal(tasks.workingTask.value))
		await goals.completeGoal(tasks.workingTask.value)

	if (!datesOnSameDay(now, lastUpdate.value)) await dayChangeEvent()
}

export default function useApp() {
	return {
		tasks,
		goals,
		appStartEvent,
		update,
	}
}
