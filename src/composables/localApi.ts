import { ref, type Ref } from 'vue'

import useHelperFunctions from './helper'
import type { Task } from '@/types/shared.types'

const { currentTime, onSameDay, secsBetweenDates, getNextDay } = useHelperFunctions()

const tasks: Ref<Array<Task>> = ref([])
const dailyTasks: Ref<Array<Task>> = ref([])

const workdayStart: Ref<Date> = ref(new Date())
const workdayStopped: Ref<boolean> = ref(true)

const workingTask: Ref<string> = ref('')
const workingStart: Ref<Date> = ref(new Date())

interface LocalStorageSave {
	tasks: Array<Task>
	dailyTasks: Array<Task>
	workdayStart: string
	workdayStopped: boolean
	workingTask: string
	workingStart: string
}

function taskExists(taskName: string) {
	if (tasks.value.find((task) => task.name === taskName)) return true
	return false
}

function dailyTaskExists(taskName: string) {
	if (dailyTasks.value.find((task) => task.name === taskName)) return true
	return false
}

function findTask(taskName: string) {
	const res = tasks.value.find((task) => task.name === taskName)
	if (!res) throw new Error('Could not find daily task with name ' + taskName)
	return res
}

function findDailyTask(taskName: string) {
	const res = dailyTasks.value.find((task) => task.name === taskName)
	if (!res) throw new Error('Could not find daily task with name ' + taskName)
	return res
}

function addSecsToTask(name: string, secs: number) {
	findTask(name).secondsSpent += secs
	findDailyTask(name).secondsSpent += secs
}

function secsWorkedOn(timeStart: Date, timeEnd: Date) {
	if (timeEnd < timeStart)
		throw new Error(
			'secsWorkedOn failed with timeStart of ' + timeStart + ' and timeEnd of ' + timeEnd,
		)

	if (onSameDay(timeStart, timeEnd)) {
		return secsBetweenDates(timeStart, timeEnd)
	} else {
		const nextDay = getNextDay(timeStart)
		return secsBetweenDates(timeStart, nextDay)
	}
}

function saveToLocalStorage() {
	const save: LocalStorageSave = {
		tasks: tasks.value,
		dailyTasks: dailyTasks.value,

		workdayStart: workdayStart.value.toString(),
		workdayStopped: workdayStopped.value,

		workingTask: workingTask.value,
		workingStart: workingStart.value.toString(),
	}
	localStorage.setItem('save', JSON.stringify(save))
	console.log('saved with', save)
}

function loadFromLocalStorage() {
	const data = localStorage.getItem('save')
	if (!data) return false

	const save: LocalStorageSave = JSON.parse(data)
	console.log('found', save)

	//reset app state back to how it was saved
	tasks.value = save.tasks
	dailyTasks.value = save.dailyTasks

	workdayStart.value = new Date(save.workdayStart)
	workdayStopped.value = save.workdayStopped

	workingStart.value = new Date(save.workingStart)
	workingTask.value = save.workingTask

	if (!save.workdayStopped) {
		setWorkingTask(save.workingTask)
		if (!onSameDay(workingStart.value, currentTime())) stopWorkday()
	}

	return true
}

function createTask(name: string, color: string) {
	if (taskExists(name)) return
	tasks.value.push({
		name: name,
		color: color,
		secondsSpent: 0,
		secondsTracked: 0,
	})

	saveToLocalStorage()
}

function updateTask(name: string, color: string) {
	const selected = findTask(name)

	selected.name = name
	selected.color = color
	if (workingTask.value === selected.name) setWorkingTask(name)

	saveToLocalStorage()
}

function deleteTask(name: string) {
	if (workingTask.value === name) setWorkingTask('Idling')
	tasks.value = tasks.value.filter((task) => task.name !== name)

	saveToLocalStorage()
}

function setWorkingTask(name: string) {
	if (!workdayStopped.value)
		addSecsToTask(workingTask.value, secsWorkedOn(workingStart.value, currentTime()))

	workingTask.value = name
	workingStart.value = currentTime()
	if (!dailyTaskExists(name)) {
		dailyTasks.value.push({
			name: name,
			color: findTask(workingTask.value).color,
			secondsSpent: 0,
			secondsTracked: 0,
		})
	}

	saveToLocalStorage()
}

function removeWorkingTask() {
	if (!workdayStopped.value)
		addSecsToTask(workingTask.value, secsWorkedOn(workingStart.value, currentTime()))

	workingTask.value = ''
	workingStart.value = new Date()

	saveToLocalStorage()
}

function startWorkday() {
	setWorkingTask('Idling')
	workdayStopped.value = false

	if (dailyTasks.value[0].secondsSpent === 0) {
		workdayStart.value = currentTime()
	}

	saveToLocalStorage()
}

function stopWorkday() {
	removeWorkingTask()
	workdayStopped.value = true

	if (!onSameDay(workdayStart.value, currentTime())) {
		console.log(
			'detected the current time to be the day ahead of',
			workdayStart.value,
			'wiping daily',
		)
		workdayStart.value = new Date()
		dailyTasks.value = []
	}

	saveToLocalStorage()
}

window.onload = () => {
	if (!loadFromLocalStorage()) {
		createTask('Idling', '#008FFF')
	}
	setInterval(() => {
		if (workdayStopped.value) return

		if (workingTask.value) {
			findTask(workingTask.value).secondsTracked += 1
			findDailyTask(workingTask.value).secondsTracked += 1
		}
		if (!onSameDay(workdayStart.value, currentTime())) stopWorkday()
	}, 1000)
}

export default function useLocalApi() {
	return {
		tasks,
		dailyTasks,
		workdayStopped,
		workingTask,
		workingStart,
		createTask,
		updateTask,
		deleteTask,
		setWorkingTask,
		startWorkday,
		stopWorkday,
	}
}
