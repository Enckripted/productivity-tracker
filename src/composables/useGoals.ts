import { ref, watch, type Ref } from 'vue'
import useTasks from './useTasks'
import useSupabaseGoals from './supabase/useSupabaseGoals'
import { type Goal } from '@/types/shared.types'
import useHelperFunctions from './useHelper'

const tasks = useTasks()
const supabaseApi = useSupabaseGoals()
const { now, secsWorkedBetween } = useHelperFunctions()

const goalsList: Ref<Goal[]> = ref([])
const streak = ref(0)

function goalExistsWithTask(taskId: number) {
	return !!goalsList.value.find((goal) => goal.taskId === taskId)
}

function getGoal(id: number) {
	const res = goalsList.value.find((goal) => goal.id === id)
	if (!res) throw new Error('Goal with id ' + id + ' does not exist')
	return res
}

function getGoalWithTask(taskId: number) {
	const res = goalsList.value.find((goal) => goal.taskId === taskId)
	if (!res) throw new Error('Goal with task id ' + taskId + ' does not exist')
	return res
}

async function loadInitialState() {
	goalsList.value = await supabaseApi.getGoals()
	streak.value = await supabaseApi.getGoalStreak()
}

async function createGoal(taskId: number, secondsThreshold: number, goalUnderThreshold: boolean) {
	if (goalsList.value.find((goal) => goal.taskId === taskId))
		throw new Error('Goal tracking task id ' + taskId + ' already exists')

	const res = await supabaseApi.createGoal(taskId, secondsThreshold, goalUnderThreshold)
	goalsList.value.push(res)
}

async function editGoal(
	id: number,
	taskId: number,
	secondsThreshold: number,
	goalUnderThreshold: boolean,
) {
	const res = await supabaseApi.editGoal(id, taskId, secondsThreshold, goalUnderThreshold)
	goalsList.value = goalsList.value.map((goal) => (goal.id === id ? res : goal))
}

async function deleteGoal(id: number) {
	await supabaseApi.deleteGoal(id)
	goalsList.value = goalsList.value.filter((goal) => goal.id !== id)
}

function canCompleteGoal(id: number) {
	const goal = getGoal(id)

	const timeWorked =
		tasks.findTaskWithId(goal.taskId).secondsWorkedToday +
		(goal.taskId === tasks.workingTask.value
			? secsWorkedBetween(tasks.workingStart.value, now.value)
			: 0)
	if (
		(goal.goalUnderThreshold && timeWorked < goal.secondsThreshold) ||
		(!goal.goalUnderThreshold && timeWorked >= goal.secondsThreshold)
	)
		return true

	return false
}

function completedAllGoals() {
	let res = true
	for (const goal of goalsList.value) {
		res = res && canCompleteGoal(goal.id)
	}
	return res && goalsList.value.length > 0
}

async function incrementStreak() {
	streak.value = await supabaseApi.updateGoalStreak(streak.value + 1)
}

async function clearStreak() {
	streak.value = await supabaseApi.updateGoalStreak(0)
}

watch(tasks.taskList, async (cur, old) => {
	if (cur.length >= old.length) return //only run this code on deletions

	const removed = old.filter((task) => !cur.includes(task))
	for (const task of removed) {
		if (goalExistsWithTask(task.id)) {
			const res = getGoalWithTask(task.id)
			await deleteGoal(res.id)
		}
	}
})

export default function useGoals() {
	return {
		goalExistsWithTask,
		getGoal,
		getGoalWithTask,
		loadInitialState,
		goalsList,
		streak,
		createGoal,
		editGoal,
		deleteGoal,
		canCompleteGoal,
		completedAllGoals,
		incrementStreak,
		clearStreak,
	}
}
