import type { Task } from '@/types/shared.types'
import { ref, type Ref } from 'vue'
import useSupabaseApi from './useSupabaseApi'

const supabaseApi = useSupabaseApi()

const tasks: Ref<Array<Task>> = ref([])
const workingTask = ref(-1)
const workingStart = ref(new Date('2000-01-01 00:00:00+00'))
const dayRunning = ref(false)
const dayStart = ref(new Date('2000-01-01 00:00:00+00'))

const updatingWorkingTask = ref(false)

//helper functions
function datesOnSameDay(d1: Date, d2: Date) {
	return d1.toDateString() === d2.toDateString()
}

function dateOnNextDay(d: Date) {
	const next = new Date(d)
	next.setDate(d.getDate() + 1)
	next.setHours(0, 0, 0, 0)
	return next
}

function secondsBetweenDates(d1: Date, d2: Date) {
	return Math.floor(Math.abs(d1.getTime() - d2.getTime()) / 1000)
}

//actual logic
function taskExists(name: string) {
	return tasks.value.find((task) => task.name === name)
}

function findTaskWithName(name: string) {
	const res = tasks.value.find((task) => task.name === name)
	if (!res) throw new Error('could not find task with name ' + name)
	return res
}

function findTaskWithId(id: number) {
	const res = tasks.value.find((task) => task.id === id)
	if (!res) throw new Error('Could not find task with id ' + id)
	return res
}

function timeWorkedBetween(workStart: Date, workEnd: Date) {
	if (datesOnSameDay(workStart, workEnd)) return secondsBetweenDates(workStart, workEnd)
	else return secondsBetweenDates(workStart, dateOnNextDay(workStart))
}

async function loadInitialAppState() {
	const state = await supabaseApi.getAppState()
	console.log('loaded app with state', state)
	tasks.value = state.tasks
	workingTask.value = state.workingTask
	workingStart.value = state.workingStart
	dayRunning.value = state.dayRunning
	dayStart.value = state.dayStart
}

async function createTask(name: string, color: string) {
	if (taskExists(name)) throw new Error('Task with name ' + name + ' already exists')

	const res = await supabaseApi.createTask(name, color)
	tasks.value.push(res)
	return res
}

async function editTask(id: number, name: string, color: string) {
	const res = await supabaseApi.editTask(id, name, color)
	tasks.value = tasks.value.map((task) => (task.id === id ? res : task))
}

async function deleteTask(id: number) {
	await supabaseApi.deleteTask(id)
	tasks.value = tasks.value.filter((task) => task.id !== id)
}

async function addSecondsToTask(id: number, seconds: number) {
	const res = await supabaseApi.addSecondsToTask(id, seconds)
	const task = findTaskWithId(id)
	task.secondsWorked = res.secondsWorked
	task.secondsWorkedToday = res.secondsWorkedToday
}

async function setWorkingTask(id: number) {
	const now = new Date()

	if (workingTask.value !== -1) {
		//working task is not null, get time between
		console.log('time spent: ', timeWorkedBetween(workingStart.value, now))
		await addSecondsToTask(workingTask.value, timeWorkedBetween(workingStart.value, now))
		updatingWorkingTask.value = true
	}

	await supabaseApi.setWorkingTask(id, now)
	workingTask.value = id
	workingStart.value = now
	updatingWorkingTask.value = false
}

async function startWorkday() {
	const now = new Date()

	if (!datesOnSameDay(dayStart.value, now)) {
		await supabaseApi.startWorkday(now)
		dayStart.value = now
	} else {
		await supabaseApi.startWorkday(workingStart.value)
	}
	await setWorkingTask(findTaskWithName('Idling').id)
	dayRunning.value = true
}

async function endWorkday() {
	const now = new Date()

	await setWorkingTask(-1)
	if (!datesOnSameDay(dayStart.value, now)) await wipeDailies()
	await supabaseApi.stopWorkday()
	dayRunning.value = false
}

async function wipeDailies() {
	await supabaseApi.wipeDailyTimes()
	for (const task of tasks.value) {
		task.secondsWorkedToday = 0
	}
}

export default function useApp() {
	return {
		taskExists,
		findTaskWithName,
		findTaskWithId,
		tasks,
		workingTask,
		workingStart,
		dayRunning,
		dayStart,
		loadInitialAppState,
		createTask,
		editTask,
		deleteTask,
		setWorkingTask,
		startWorkday,
		endWorkday,
		updatingWorkingTask,
	}
}
