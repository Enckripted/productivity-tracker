import { describe, beforeEach, it, expect, vi } from 'vitest'
import useGoals from '@/composables/useGoals'

const mockSupabase = vi.hoisted(() => ({
	getGoals: vi.fn(),
	getGoalStreak: vi.fn(),
	createGoal: vi.fn(),
	editGoal: vi.fn(),
	deleteGoal: vi.fn(),
	markGoalCompleted: vi.fn(),
	clearGoalCompletions: vi.fn(),
	updateGoalStreak: vi.fn(),
}))
vi.mock('@/composables/supabase/useSupabaseGoals', () => ({
	default: vi.fn(() => mockSupabase),
}))

const mockTasks = vi.hoisted(() => ({
	dayRunning: { value: false },
	workingTask: { value: -1 },
	workingStart: { value: new Date('2000-01-01T00:00:00Z') },
	taskList: { value: [] },
	findTaskWithId: vi.fn(),
}))
vi.mock('@/composables/useTasks', () => ({
	default: vi.fn(() => mockTasks),
}))

const app = useGoals()
function baseGoal() {
	return {
		id: 1,
		taskId: 10,
		secondsThreshold: 300,
		goalUnderThreshold: false,
		completed: false,
	}
}

const now = new Date()
const twoMinsBeforeNow = new Date(now.valueOf() - 120 * 1000)

//most of these are ai generated
describe('Goals unit test', () => {
	beforeEach(async () => {
		vi.clearAllMocks()
		vi.useFakeTimers()

		mockSupabase.getGoals.mockResolvedValue([baseGoal()])
		mockSupabase.getGoalStreak.mockResolvedValue(0)
		vi.setSystemTime(new Date())

		await app.loadInitialState()
	})

	it('Should load initial state', () => {
		expect(app.goalsList.value[0]).toMatchObject(baseGoal())
		expect(app.streak.value).toBe(0)
	})

	it('Should create a new goal', async () => {
		const newGoal = { ...baseGoal(), id: 2, taskId: 20 }
		mockSupabase.createGoal.mockResolvedValueOnce(newGoal)

		await app.createGoal(20, 300, false)

		expect(app.goalsList.value).toHaveLength(2)
		expect(app.goalsList.value[1]).toMatchObject(newGoal)
	})

	it('Should edit an existing goal', async () => {
		const edited = { ...baseGoal(), secondsThreshold: 600 }
		mockSupabase.editGoal.mockResolvedValueOnce(edited)

		await app.editGoal(baseGoal().id, baseGoal().taskId, 600, false)

		expect(app.goalsList.value[0]).toMatchObject({ secondsThreshold: 600 })
	})

	it('Should delete an existing goal', async () => {
		await app.deleteGoal(baseGoal().id)

		expect(mockSupabase.deleteGoal).toHaveBeenCalledWith(baseGoal().id)
	})

	it('Should mark a goal completed', async () => {
		await app.completeGoal(baseGoal().id)

		expect(app.goalsList.value[0].completed).toBe(true)
	})

	it('Should check if a goal can be completed (for both goalUnderThreshold states)', async () => {
		mockTasks.dayRunning.value = true
		mockTasks.workingTask.value = baseGoal().taskId
		mockTasks.workingStart.value = twoMinsBeforeNow

		mockTasks.findTaskWithId.mockReturnValue({ secondsWorked: 60 })
		expect(app.canCompleteGoal(baseGoal().id)).toBe(false)
		mockTasks.findTaskWithId.mockReturnValue({ secondsWorked: 180 })
		expect(app.canCompleteGoal(baseGoal().id)).toBe(true)

		const edited = { ...baseGoal(), goalUnderThreshold: true }
		mockSupabase.editGoal.mockResolvedValueOnce(edited)
		await app.editGoal(edited.id, edited.taskId, edited.secondsThreshold, true)

		mockTasks.findTaskWithId.mockReturnValue({ secondsWorked: 60 })
		expect(app.canCompleteGoal(baseGoal().id)).toBe(true)
		mockTasks.findTaskWithId.mockReturnValue({ secondsWorked: 180 })
		expect(app.canCompleteGoal(baseGoal().id)).toBe(false)
	})

	it('Should check if all goals are completed', async () => {
		expect(app.completedAllGoals()).toBe(false)

		await app.completeGoal(baseGoal().id)
		expect(app.completedAllGoals()).toBe(true)
	})

	it('Should clear goal completions', async () => {
		await app.completeGoal(baseGoal().id)
		await app.clearGoalCompletions()

		expect(app.goalsList.value[0].completed).toBe(false)
	})

	it('Should increment and clear streak', async () => {
		mockSupabase.updateGoalStreak.mockResolvedValueOnce(1)
		await app.incrementStreak()
		expect(app.streak.value).toBe(1)

		mockSupabase.updateGoalStreak.mockResolvedValueOnce(0)
		await app.clearStreak()
		expect(app.streak.value).toBe(0)
	})
})
