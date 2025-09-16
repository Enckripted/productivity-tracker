export interface Task {
	id: number
	userId: string
	name: string
	color: string
	secondsWorked: number
	secondsWorkedToday: number
}

export interface AppState {
	tasks: Array<Task>
	workingTask: number
	workingStart: Date
	dayRunning: boolean
	dayStart: Date
}
