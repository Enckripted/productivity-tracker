export interface Task {
	id: number
	userId: string
	name: string
	color: string
	secondsWorked: number
	secondsWorkedToday: number
}

export interface Goal {
	id: number
	taskId: number
	secondsThreshold: number
	goalUnderThreshold: boolean
}

export interface AppState {
	tasks: Array<Task>
	workingTask: number
	workingStart: Date
	dayRunning: boolean
	dayStart: Date
}
