function currentTime() {
	return new Date()
}

function onSameDay(d1: Date, d2: Date) {
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

export default function useHelperFunctions() {
	return { currentTime, onSameDay, secsBetweenDates, getNextDay }
}
