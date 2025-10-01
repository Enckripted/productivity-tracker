import { computed, ref } from 'vue'
import useTasks from './useTasks'
import useGoals from './useGoals'
import useSupabase from './supabase/useSupabase'
import useHelperFunctions from './useHelper'
import useSupabaseAuth from './supabase/useSupabaseAuth'

const supabase = useSupabase()
const supabaseAuth = useSupabaseAuth()
const tasks = useTasks()
const goals = useGoals()
const { datesOnSameDay } = useHelperFunctions()

const lastUpdate = ref(new Date())

const userId = computed(() => {
	return supabaseAuth.session.value?.user.id || '-1'
})

//supabase
async function wipeData() {
	await supabase.from('users').update({
		last_update: new Date().toISOString(),
		working_task: -1,
		working_start: new Date().toISOString(),
		day_running: false,
		day_start: new Date().toISOString(),
		goal_streak: 0,
	})
	await supabase.from('tasks').delete().eq('user_id', userId.value)
	await supabase.from('goals').delete().eq('user_id', userId.value)

	await tasks.createTask('Idling', '#008FFF')
}

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
		.eq('id', userId.value)
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

	if (tasks.dayRunning) await tasks.endWorkday()

	lastUpdate.value = await setLastUpdate(new Date())
}

async function update() {
	const now = new Date()

	if (!datesOnSameDay(now, lastUpdate.value)) await dayChangeEvent()
}

export default function useApp() {
	return {
		tasks,
		goals,
		appStartEvent,
		update,
		wipeData,
	}
}
