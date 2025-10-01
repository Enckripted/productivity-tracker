import { describe, beforeEach, expect, it } from 'vitest'
import useSupabaseGoals from '@/composables/supabase/useSupabaseGoals'
import useSupabase from '@/composables/supabase/useSupabase'
import useSupabaseAuth from '@/composables/supabase/useSupabaseAuth'
import { computed } from 'vue'

const supabase = useSupabase()
const supabaseGoals = useSupabaseGoals()
const { session, login, signup } = useSupabaseAuth()
const userId = computed(() => (session.value ? session.value.user.id : ''))

describe('Supabase Goals Integration', () => {
	beforeEach(async () => {
		if (!session.value) {
			const { error } = await signup('test-goals@yopmail.com', 'abcdef')
			if (error) await login('test-goals@yopmail.com', 'abcdef')
		}

		await supabase.from('users').update({ goal_streak: 0 }).eq('id', userId.value)
		await supabase.from('goals').delete().neq('id', -1)
	})

	it('Should create a goal', async () => {
		const res = await supabaseGoals.createGoal(123, 3600, true)

		expect(res).toMatchObject({
			taskId: 123,
			secondsThreshold: 3600,
			goalUnderThreshold: true,
			completed: false,
		})
	})

	it('Should edit a goal', async () => {
		const orig = await supabaseGoals.createGoal(123, 3600, true)
		const res = await supabaseGoals.editGoal(orig.id, 456, 1800, false)

		expect(res).toMatchObject({
			taskId: 456,
			secondsThreshold: 1800,
			goalUnderThreshold: false,
		})
	})

	it('Should get all goals', async () => {
		await supabaseGoals.createGoal(123, 3600, true)
		await supabaseGoals.createGoal(456, 1800, false)

		expect(await supabaseGoals.getGoals()).toHaveLength(2)
	})

	it('Should delete a goal', async () => {
		const orig = await supabaseGoals.createGoal(123, 3600, true)
		await supabaseGoals.deleteGoal(orig.id)

		expect(await supabaseGoals.getGoals()).toHaveLength(0)
	})

	it('Should get goal streak', async () => {
		expect(await supabaseGoals.getGoalStreak()).toBe(0)
	})

	it('Should get and update goal streak', async () => {
		expect(await supabaseGoals.updateGoalStreak(5)).toBe(5)
	})
})
