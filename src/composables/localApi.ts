import { ref } from "vue"

import useHelperFunctions from "./helper"

const { currentTime, onSameDay, secsBetweenDates, getNextDay } = useHelperFunctions()

const tasks = ref([])

const dailyTasks = ref([])
const workdayStart = ref("")
const workdayStopped = ref(true)

const workingTask = ref("")
const workingStart = ref("")

function findTask(taskName) {
	return tasks.value.find((task) => task.name == taskName)
}

function findDailyTask(taskName) {
	return dailyTasks.value.find((task) => task.name == taskName)
}

function addSecsToTask(name, secs) {
	findTask(name).secondsSpent += secs
	findDailyTask(name).secondsSpent += secs
}

function secsWorkedOn(timeStart, timeEnd) {
	if (timeEnd < timeStart)
		console.error("secsWorkedOn failed with timeStart of", timeStart, "and timeEnd of", timeEnd)

	if (onSameDay(timeStart, timeEnd)) {
		return secsBetweenDates(timeStart, timeEnd)
	} else {
		const nextDay = getNextDay(timeStart)
		return secsBetweenDates(timeStart, nextDay)
	}
}

function saveToLocalStorage() {
	localStorage.setItem(
		"save",
		JSON.stringify({
			tasks: tasks.value,

			dailyTasks: dailyTasks.value,
			workdayStart: workdayStart.value,
			workdayStopped: workdayStopped.value,

			workingTask: workingTask.value,
			workingStart: workingStart.value,
		}),
	)
	console.log("saved with", JSON.parse(localStorage.getItem("save")))
}

function loadFromLocalStorage() {
	const data = localStorage.getItem("save")
	if (!data) return false
	const save = JSON.parse(data)
	console.log("found", save)

	tasks.value = save.tasks
	dailyTasks.value = save.dailyTasks

	if (save.workingStart) {
		addSecsToTask(save.workingTask, secsWorkedOn(new Date(save.workingStart), currentTime()))
		setWorkingTask(save.workingTask)
	}
	workdayStart.value = new Date(save.workdayStart)
	workdayStopped.value = save.workdayStopped
	//note if save.workingStart is an empty string, this condition will become false and will work fine anyways
	if (!onSameDay(new Date(save.workingStart), currentTime())) stopWorkday()
	return true
}

function createTask(name, color) {
	if (findTask(name)) return
	tasks.value.push({
		name: name,
		color: color,
		secondsSpent: 0,
		secondsTracked: 0,
	})

	saveToLocalStorage()
}

function updateTask(name, color) {
	const selected = findTask(name)

	selected.name = name
	selected.color = color
	if (workingTask.value == selected.name) setWorkingTask(name)

	saveToLocalStorage()
}

function deleteTask(name) {
	if (workingTask.value == name) setWorkingTask("Idling")
	tasks.value = tasks.value.map((task) => task.name != name)

	saveToLocalStorage()
}

function setWorkingTask(name) {
	if (!workdayStopped.value)
		addSecsToTask(workingTask.value, secsWorkedOn(workingStart.value, currentTime()))

	workingTask.value = name
	workingStart.value = currentTime()
	if (!findDailyTask(name)) {
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

	workingTask.value = ""
	workingStart.value = ""

	saveToLocalStorage()
}

function startWorkday() {
	setWorkingTask("Idling")
	workdayStopped.value = false

	if (dailyTasks.value[0].secondsSpent == 0) {
		workdayStart.value = currentTime()
	}

	saveToLocalStorage()
}

function stopWorkday() {
	removeWorkingTask()
	workdayStopped.value = true

	if (!onSameDay(workdayStart.value, currentTime())) {
		console.log(
			"detected the current time to be the day ahead of",
			workdayStart.value,
			"wiping daily",
		)
		workdayStart.value = ""
		dailyTasks.value = []
	}

	saveToLocalStorage()
}

window.onload = () => {
	if (!loadFromLocalStorage()) {
		createTask("Idling", "#008FFF")
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
