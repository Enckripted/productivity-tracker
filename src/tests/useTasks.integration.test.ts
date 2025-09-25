import { describe, it, expect, beforeEach, vi } from 'vitest'
import useTasks from '@/composables/useTasks'
import useSupabase from '@/composables/supabase/useSupabase'
import useSupabaseAuth from '@/composables/supabase/useSupabaseAuth'
import { computed } from 'vue'

const supabase = useSupabase()
const app = useTasks()
const { session, login, signup } = useSupabaseAuth()

const userId = computed(() => (session.value ? session.value.user.id : ''))

const start = new Date()
start.setHours(0, 0, 0, 0)
const fiveMinsPastStart = new Date(start)
fiveMinsPastStart.setHours(0, 5, 0, 0)
const dayPastFiveMins = new Date(fiveMinsPastStart)
dayPastFiveMins.setDate(dayPastFiveMins.getDate() + 1)

describe('Tasks integration test', () => {
	beforeEach(async () => {
		if (!session.value) {
			const { error } = await signup('test@yopmail.com', 'abcdef')
			if (error) await login('test@yopmail.com', 'abcdef')
		}
		await supabase
			.from('users')
			.update({
				working_task: -1,
				working_start: new Date('Jan 01 2001').toISOString(),
				day_running: false,
				day_start: new Date('Jan 01 2001').toISOString(),
			})
			.eq('id', userId.value)
		await supabase.from('tasks').delete().neq('name', 'Idling')
		await supabase
			.from('tasks')
			.update({
				seconds_worked: 0,
				seconds_worked_today: 0,
			})
			.eq('name', 'Idling')

		await app.loadInitialState()
		vi.useFakeTimers()
	})

	it('Should create a task', async () => {
		await app.createTask('Task', '#000000')
		expect(app.taskList.value).toHaveLength(2)
		expect(app.taskList.value[1]).toMatchObject({
			name: 'Task',
			color: '#000000',
		})
	})

	it('Should edit a task', async () => {
		await app.createTask('Task', '#000000')
		await app.editTask(app.taskList.value[1].id, 'Task Edit', '#000001')
		expect(app.taskList.value[1]).toMatchObject({
			name: 'Task Edit',
			color: '#000001',
		})
	})

	it('Should delete a task', async () => {
		await app.createTask('Task', '#000000')
		await app.deleteTask(app.taskList.value[1].id)
		expect(app.taskList.value).toHaveLength(1)
	})

	it('Should start the workday', async () => {
		vi.setSystemTime(start)

		await app.startWorkday()
		expect(app.workingTask.value).toBe(app.taskList.value[0].id)
		expect(app.dayRunning.value).toBeTruthy()
		expect(app.dayStart.value.toISOString()).toBe(start.toISOString())
	})

	it('Should set the working task', async () => {
		await app.startWorkday()
		await app.createTask('Task', '#000000')
		await app.setWorkingTask(app.taskList.value[1].id)
		expect(app.workingTask.value).toBe(app.taskList.value[1].id)
	})

	it('Should add seconds when setting working task', async () => {
		vi.setSystemTime(start)

		await app.createTask('Task', '#000000')
		await app.startWorkday()
		vi.setSystemTime(fiveMinsPastStart)
		await app.setWorkingTask(app.taskList.value[1].id)

		expect(app.taskList.value[0]).toMatchObject({
			secondsWorked: 300,
			secondsWorkedToday: 300,
		})
	})

	it('Should add seconds up to days end when setting working task', async () => {
		vi.setSystemTime(start)

		await app.createTask('Task', '#000000')
		await app.startWorkday()
		vi.setSystemTime(dayPastFiveMins)
		await app.setWorkingTask(app.taskList.value[1].id)

		expect(app.taskList.value[0]).toMatchObject({
			secondsWorked: 60 * 60 * 24,
		})
	})

	it('Should end the workday', async () => {
		await app.startWorkday()
		await app.endWorkday()

		expect(app.dayRunning.value).toBeFalsy()
	})

	it("Should end the workday and not wipe dailies if day hasn't passed", async () => {
		vi.setSystemTime(start)

		await app.startWorkday()
		vi.setSystemTime(fiveMinsPastStart)
		await app.endWorkday()

		expect(app.taskList.value[0]).toMatchObject({
			secondsWorked: 300,
			secondsWorkedToday: 300,
		})
	})

	it('Should end the workday and wipe dailies when day passes', async () => {
		vi.setSystemTime(start)

		await app.startWorkday()
		vi.setSystemTime(dayPastFiveMins)
		await app.endWorkday()

		expect(app.taskList.value[0]).toMatchObject({
			secondsWorked: 60 * 60 * 24,
			secondsWorkedToday: 0,
		})
	})
})
