import { ref } from 'vue'

const now = ref(new Date())
setInterval(() => {
	now.value = new Date()
}, 1000)

function datesOnSameDay(d1: Date, d2: Date) {
	return d1.toDateString() === d2.toDateString()
}

function secsBetweenDates(d1: Date, d2: Date) {
	return Math.floor(Math.abs(d1.getTime() - d2.getTime()) / 1000)
}

function getNextDay(from: Date) {
	const next = new Date(from)
	next.setDate(from.getDate() + 1)
	next.setHours(0, 0, 0, 0)
	return next
}

function secsWorkedSince(start: Date) {
	if (datesOnSameDay(start, new Date())) {
		return secsBetweenDates(start, new Date())
	} else {
		return secsBetweenDates(start, getNextDay(start))
	}
}

function formatTimeSpent(timeInSecs: number) {
	const secs = timeInSecs % 60
	const mins = Math.floor((timeInSecs - secs) / 60) % 60
	const hrs = Math.floor((timeInSecs - mins * 60 - secs) / 3600)

	let result = ''
	if (hrs > 0) result += `${hrs} ${hrs !== 1 ? 'hrs' : 'hr'} `
	if (mins > 0) result += `${mins} ${mins !== 1 ? 'mins' : 'min'} `
	result += `${secs} ${secs !== 1 ? 'secs' : 'sec'}`
	return result
}

export default function useHelperFunctions() {
	return {
		now,
		datesOnSameDay,
		secsBetweenDates,
		getNextDay,
		secsWorkedSince,
		formatTimeSpent,
	}
}
