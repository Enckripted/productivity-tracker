import { vi, describe, it, beforeEach, expect } from 'vitest'
import useApp from '@/composables/useApp'
import type { Task } from '@/types/shared.types'

const mock = vi.hoisted(() => {
	return {
		getAppState: vi.fn(),
		createTask: vi.fn(),
		editTask: vi.fn(),
		addSecondsToTask: (_: number, seconds: number) => ({
			secondsWorked: seconds,
			secondsWorkedToday: seconds,
		}), //uh oh
		deleteTask: vi.fn(),
		setWorkingTask: vi.fn(),
		startWorkday: vi.fn(),
		stopWorkday: vi.fn(),
		wipeDailyTimes: vi.fn(),
	}
})
vi.mock('@/composables/useSupabaseApi', () => {
	return {
		default: () => mock,
	}
})

const app = useApp()

const baseTask: Task = {
	id: 0,
	userId: 'blank',
	name: 'Idling',
	color: '#ABCDEF',
	secondsWorked: 0,
	secondsWorkedToday: 0,
}

const start = new Date()
start.setHours(0, 0, 0, 0)
const fiveMinsPastStart = new Date(start)
fiveMinsPastStart.setHours(0, 5, 0, 0)
const dayPastFiveMins = new Date(start)
dayPastFiveMins.setDate(dayPastFiveMins.getDate() + 1)
dayPastFiveMins.setHours(0, 5, 0, 0)

describe('App Logic Test', () => {
	beforeEach(async () => {
		vi.clearAllMocks()

		vi.useFakeTimers()

		mock.getAppState.mockResolvedValue({
			tasks: [],
			workingTask: -1,
			workingStart: new Date('2000-01-01 00:00:00+00'),
			dayRunning: false,
			dayStart: new Date('2000-01-01 00:00:00+00'),
		})
		await app.loadInitialAppState()
	})

	it('Should have loaded initial state', () => {
		expect(app.tasks.value).toHaveLength(0)
		expect(app.workingTask.value).toBe(-1)
		expect(app.dayRunning.value).toBe(false)
	})

	it('Should create a task', async () => {
		mock.createTask.mockResolvedValueOnce(baseTask)
		await app.createTask('Idling', '#ABCDEF')

		expect(app.tasks.value).toHaveLength(1)
		expect(app.tasks.value[0]).toMatchObject(baseTask)
	})

	it('Should edit a task', async () => {
		mock.createTask.mockResolvedValueOnce(baseTask)
		await app.createTask('Idling', '#ABCDEF')
		mock.editTask.mockResolvedValue({
			id: 0,
			userId: 'blank',
			name: 'Task',
			color: '#000000',
			secondsWorked: 0,
			secondsWorkedToday: 0,
		})
		await app.editTask(0, 'Task', '#000000')

		expect(app.tasks.value).toHaveLength(1)
		expect(app.tasks.value[0]).toMatchObject({
			id: 0,
			userId: 'blank',
			name: 'Task',
			color: '#000000',
			secondsWorked: 0,
			secondsWorkedToday: 0,
		})
	})

	it('Should delete a task', async () => {
		mock.createTask.mockResolvedValue(baseTask)
		await app.createTask('Idling', '#ABCDEF')
		await app.deleteTask(0)

		expect(app.tasks.value).toHaveLength(0)
	})

	it('Should start the workday', async () => {
		vi.setSystemTime(start)
		mock.createTask.mockResolvedValue(structuredClone(baseTask))
		await app.createTask('Idling', '#ABCDEF')
		await app.startWorkday()
		expect(app.dayRunning.value).toBeTruthy()
		expect(app.dayStart.value.toISOString()).toBe(start.toISOString())
	})

	it('Should switch tasks mid day', async () => {
		vi.setSystemTime(start)
		mock.createTask.mockResolvedValue(structuredClone(baseTask))
		await app.createTask('Idling', '#ABCDEF')
		mock.createTask.mockResolvedValue({
			id: 1,
			userId: '',
			secondsWorked: 0,
			secondsWorkedToday: 0,
			name: 'Other Task',
			color: '#ABCDEF',
		})
		await app.createTask('Other Task', '#ABCDEF')
		await app.startWorkday()

		vi.setSystemTime(fiveMinsPastStart)
		await app.setWorkingTask(1)

		expect(app.workingTask.value).toBe(1)
		expect(app.workingStart.value.toISOString()).toBe(fiveMinsPastStart.toISOString())
		expect(app.tasks.value[0]).toMatchObject({
			secondsWorked: 300,
			secondsWorkedToday: 300,
		})
	})

	it('Should properly calculate time spanning multiple days', async () => {
		vi.setSystemTime(start)
		mock.createTask.mockResolvedValue(structuredClone(baseTask))
		await app.createTask('Idling', '#ABCDEF')
		await app.startWorkday()

		vi.setSystemTime(dayPastFiveMins)
		await app.setWorkingTask(0)

		expect(app.tasks.value[0]).toMatchObject({
			secondsWorked: 60 * 60 * 24,
		})
		expect(app.workingStart.value.toISOString()).toBe(dayPastFiveMins.toISOString())
	})

	it('Should stop workday and clear daily times', async () => {
		vi.setSystemTime(start)
		mock.createTask.mockResolvedValue(structuredClone(baseTask))
		await app.createTask('Idling', '#ABCDEF')
		await app.startWorkday()

		vi.setSystemTime(dayPastFiveMins)
		await app.endWorkday()
		console.log(app.tasks.value[0])
		expect(app.tasks.value[0]).toMatchObject({
			secondsWorked: 60 * 60 * 24,
			secondsWorkedToday: 0,
		})
	})
})
