import { describe, beforeEach, expect, it } from 'vitest'
import useSupabaseApi from '@/composables/useSupabaseApi'
import useSupabase from '@/composables/useSupabase'
import useSupabaseAuth from '@/composables/useSupabaseAuth'
import { computed } from 'vue'

const supabase = useSupabase()
const supabaseApi = useSupabaseApi()
const { session, login, signup } = useSupabaseAuth()

const userId = computed(() => (session.value ? session.value.user.id : ''))

describe('Supabase API Integration ', async () => {
	const { error } = await signup('test@yopmail.com', 'abcdef')
	if (error) await login('test@yopmail.com', 'abcdef')

	beforeEach(async () => {
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
	})

	it('Should create a task', async () => {
		const res = await supabaseApi.createTask('Task', '#ABCDEF')
		expect(res).toMatchObject({
			name: 'Task',
			color: '#ABCDEF',
		})
	})

	it('Should update a task', async () => {
		const orig = await supabaseApi.createTask('Task', '#000000')
		const res = await supabaseApi.editTask(orig.id, 'Task Updated', '#ABCDEF')
		expect(res).toMatchObject({
			name: 'Task Updated',
			color: '#ABCDEF',
		})
	})

	it('Should add seconds to a task', async () => {
		const orig = await supabaseApi.createTask('Task', '#000000')
		const res = await supabaseApi.addSecondsToTask(orig.id, 120)
		expect(res).toMatchObject({
			secondsWorked: 120,
			secondsWorkedToday: 120,
		})
	})

	it('Should delete a task', async () => {
		const orig = await supabaseApi.createTask('Task', '#000000')
		await supabaseApi.deleteTask(orig.id)
		expect(
			(await supabaseApi.getAppState()).tasks.find((task) => task.id === orig.id),
		).toBeUndefined()
	})

	it('Should set the working task', async () => {
		const orig = await supabaseApi.createTask('Task', '#000000')
		const now = new Date()
		await supabaseApi.setWorkingTask(orig.id, now)
		expect(await supabaseApi.getAppState()).toMatchObject({
			workingTask: orig.id,
			workingStart: now,
		})
	})

	it('Should wipe daily seconds from all tasks', async () => {
		const orig = await supabaseApi.createTask('Task', '#000000')
		await supabaseApi.addSecondsToTask(orig.id, 120)
		await supabaseApi.wipeDailyTimes()
		const res = (await supabaseApi.getAppState()).tasks.find((task) => task.id === orig.id)
		expect(res).toMatchObject({
			secondsWorked: 120,
			secondsWorkedToday: 0,
		})
	})

	it('Should start the workday', async () => {
		const now = new Date()
		await supabaseApi.startWorkday(now)
		expect(await supabaseApi.getAppState()).toMatchObject({
			dayRunning: true,
			dayStart: now,
		})
	})

	it('Should end the workday', async () => {
		await supabaseApi.startWorkday(new Date())
		await supabaseApi.stopWorkday()
		expect(await supabaseApi.getAppState()).toMatchObject({
			dayRunning: false,
		})
	})
})
