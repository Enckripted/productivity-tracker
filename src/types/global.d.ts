export {};

declare global {
	interface Task {
		name: String;
		color: String;
		secondsSpent: number;
	}
}
