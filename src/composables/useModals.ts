import { type Ref, ref } from 'vue'

class Modal {
	id: Ref<number>
	active: Ref<boolean>

	constructor() {
		this.id = ref(-1)
		this.active = ref(false)
	}

	open(id: number) {
		this.id.value = id
		this.active.value = true
	}
}

const modals = {
	taskEditModal: new Modal(),
	taskDeleteModal: new Modal(),
	goalEditModal: new Modal(),
	goalDeleteModal: new Modal(),
}

export default function useModals() {
	return modals
}
