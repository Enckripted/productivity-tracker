import camelcaseKeys from 'camelcase-keys'
import useSupabase from './useSupabase'
import { type AppState, type Task } from '@/types/shared.types'
import useSupabaseAuth from './useSupabaseAuth'
import { computed } from 'vue'

const supabase = useSupabase()
const { session } = useSupabaseAuth()

const userId = computed(() => (session.value ? session.value.user.id : ''))

async function getAppState() {
	const { data: profile, error: pError } = await supabase.from('users').select().single()
	if (pError) throw pError
	const { data: tasks, error: tError } = await supabase.from('tasks').select()
	if (tError) throw tError

	const appState: AppState = {
		tasks: camelcaseKeys(tasks),
		workingTask: profile.working_task ? profile.working_task : -1,
		workingStart: new Date(profile.working_start),
		dayRunning: profile.day_running,
		dayStart: new Date(profile.day_start),
	}

	return appState
}

async function wipeDailyTimes() {
	const { error } = await supabase
		.from('tasks')
		.update({
			seconds_worked_today: 0,
		})
		.eq('user_id', userId.value)
	if (error) throw error
}

async function startWorkday(start: Date) {
	const { error } = await supabase
		.from('users')
		.update({
			day_running: true,
			day_start: start.toISOString(),
		})
		.eq('id', userId.value)
	if (error) throw error
}

async function stopWorkday() {
	const { error } = await supabase
		.from('users')
		.update({
			day_running: false,
		})
		.eq('id', userId.value)
	if (error) throw error
}

async function createTask(name: string, color: string): Promise<Task> {
	const { data, error } = await supabase
		.from('tasks')
		.insert({
			name: name,
			color: color,
		})
		.select()
		.single()
	if (error) throw error

	return camelcaseKeys(data)
}

async function editTask(id: number, name: string, color: string): Promise<Task> {
	const { data, error } = await supabase
		.from('tasks')
		.update({
			name: name,
			color: color,
		})
		.eq('id', id)
		.select()
		.single()
	if (error) throw error

	return camelcaseKeys(data)
}

async function addSecondsToTask(id: number, seconds: number) {
	const { data, error } = await supabase
		.rpc('add_seconds_to_task', {
			task_id: id,
			seconds: seconds,
		})
		.single()
	if (error) throw error

	return camelcaseKeys(data)
}

async function deleteTask(id: number) {
	const { error } = await supabase.from('tasks').delete().eq('id', id)
	if (error) throw error
}

async function setWorkingTask(id: number, start: Date) {
	const { error } = await supabase
		.from('users')
		.update({
			working_task: id,
			working_start: start.toISOString(),
		})
		.eq('id', userId.value)
	if (error) throw error
}

export default function useSupabaseApi() {
	return {
		getAppState,
		wipeDailyTimes,
		startWorkday,
		stopWorkday,
		createTask,
		editTask,
		deleteTask,
		setWorkingTask,
		addSecondsToTask,
	}
}
