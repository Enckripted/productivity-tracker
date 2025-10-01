import { describe, it, expect, beforeEach, vi } from 'vitest'
import { computed } from 'vue'
import useGoals from '@/composables/useGoals'
import useTasks from '@/composables/useTasks'
import useSupabase from '@/composables/supabase/useSupabase'
import useSupabaseAuth from '@/composables/supabase/useSupabaseAuth'

const supabase = useSupabase()
const goals = useGoals()
const tasks = useTasks()
const { session, login, signup } = useSupabaseAuth()
const userId = computed(() => (session.value ? session.value.user.id : ''))

// times used in tests (same pattern as your Tasks tests)
const start = new Date()
start.setHours(0, 0, 0, 0)
const fiveMinsPastStart = new Date(start)
fiveMinsPastStart.setMinutes(5)

describe('Goals integration test', () => {
	beforeEach(async () => {
		if (!session.value) {
			const { error } = await signup('test@yopmail.com', 'abcdef')
			if (error) await login('test@yopmail.com', 'abcdef')
		}

		await supabase.from('users').update({ goal_streak: 0 }).eq('id', userId.value)
		await supabase.from('goals').delete().neq('id', -1)

		await supabase.from('tasks').delete().neq('name', 'Idling')
		await supabase
			.from('tasks')
			.update({ seconds_worked: 0, seconds_worked_today: 0 })
			.eq('name', 'Idling')

		await tasks.loadInitialState()
		await goals.loadInitialState()

		vi.useFakeTimers()
	})

	it('Should create a goal', async () => {
		const taskId = tasks.taskList.value[0].id
		await goals.createGoal(taskId, 3600, true)

		expect(goals.goalsList.value).toHaveLength(1)
		expect(goals.goalsList.value[0]).toMatchObject({
			taskId,
			secondsThreshold: 3600,
			goalUnderThreshold: true,
			completed: false,
		})
	})

	it('Should edit a goal', async () => {
		const taskId = tasks.taskList.value[0].id
		await goals.createGoal(taskId, 3600, true)
		await goals.editGoal(goals.goalsList.value[0].id, taskId, 1800, false)

		expect(goals.goalsList.value[0]).toMatchObject({
			taskId: taskId,
			secondsThreshold: 1800,
			goalUnderThreshold: false,
		})
	})

	it('Should delete a goal', async () => {
		const taskId = tasks.taskList.value[0].id
		await goals.createGoal(taskId, 300, false)
		await goals.deleteGoal(goals.goalsList.value[0].id)
		expect(goals.goalsList.value).toHaveLength(0)
	})

	it('Should be able to detect if a goal can be completed', async () => {
		const taskId = tasks.taskList.value[0].id
		await goals.createGoal(taskId, 240, false)
		vi.setSystemTime(start)
		await tasks.startWorkday()

		expect(goals.canCompleteGoal(goals.goalsList.value[0].id)).toBe(false)
		vi.setSystemTime(fiveMinsPastStart)
		expect(goals.canCompleteGoal(goals.goalsList.value[0].id)).toBe(true)
	})

	it('Should increment and clear goal streak', async () => {
		await goals.incrementStreak()
		expect(goals.streak.value).toBe(1)

		await goals.clearStreak()
		expect(goals.streak.value).toBe(0)
	})

	/*
	this doesn't work because of the async watcher
	TODO: come up with testable implementation
	it('Should delete goals when the corresponding task is deleted', async () => {
		await tasks.createTask('dummy', '#000000')
		const taskId = tasks.taskList.value[1].id
		await goals.createGoal(taskId, 300, false)
		await tasks.deleteTask(taskId)
		expect(goals.goalsList.value).toHaveLength(0)
	})
	*/
})
