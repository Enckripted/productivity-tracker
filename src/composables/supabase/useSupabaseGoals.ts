import camelcaseKeys from 'camelcase-keys'
import useSupabase from './useSupabase'
import useSupabaseAuth from './useSupabaseAuth'
import { computed } from 'vue'
import { type Goal } from '@/types/shared.types'

const supabase = useSupabase()
const { session } = useSupabaseAuth()

const userId = computed(() => (session.value ? session.value.user.id : ''))

async function getGoalStreak() {
	const { data, error } = await supabase
		.from('users')
		.select('goal_streak')
		.eq('id', userId.value)
		.single()

	if (error) throw error
	return data.goal_streak
}

async function updateGoalStreak(streak: number) {
	const { data, error } = await supabase
		.from('users')
		.update({ goal_streak: streak })
		.eq('id', userId.value)
		.select()
		.single()

	if (error) throw error
	return data.goal_streak
}

async function getGoals() {
	const { data, error } = await supabase.from('goals').select('*')
	if (error) throw error
	return camelcaseKeys(data ?? []) as Goal[]
}

async function createGoal(taskId: number, secondsThreshold: number, goalUnderThreshold: boolean) {
	const { data, error } = await supabase
		.from('goals')
		.insert({
			task_id: taskId,
			seconds_threshold: secondsThreshold,
			goal_under_threshold: goalUnderThreshold,
			completed: false,
		})
		.select()
		.single()

	if (error) throw error
	return camelcaseKeys(data) as Goal
}

async function editGoal(
	id: number,
	taskId: number,
	secondsThreshold: number,
	goalUnderThreshold: boolean,
) {
	const { data, error } = await supabase
		.from('goals')
		.update({
			task_id: taskId,
			seconds_threshold: secondsThreshold,
			goal_under_threshold: goalUnderThreshold,
		})
		.eq('id', id)
		.select()
		.single()

	if (error) throw error
	return camelcaseKeys(data) as Goal
}

async function deleteGoal(id: number) {
	const { error } = await supabase.from('goals').delete().eq('id', id)
	if (error) throw error
}

async function markGoalCompleted(id: number) {
	const { error } = await supabase.from('goals').update({ completed: true }).eq('id', id)
	if (error) throw error
}

async function clearGoalCompletions() {
	const { error } = await supabase
		.from('goals')
		.update({ completed: false })
		.eq('user_id', userId.value)
	if (error) throw error
}

export default function useSupabaseGoals() {
	return {
		getGoalStreak,
		updateGoalStreak,
		getGoals,
		createGoal,
		editGoal,
		deleteGoal,
		markGoalCompleted,
		clearGoalCompletions,
	}
}
