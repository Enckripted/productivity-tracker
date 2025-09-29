import { ref } from 'vue'

const editId = ref(-1)
const editActive = ref(false)
const deleteId = ref(-1)
const deleteActive = ref(false)

function openEditModal(id: number) {
	editId.value = id
	editActive.value = true
}

function openDeleteModal(id: number) {
	deleteId.value = id
	deleteActive.value = true
}

export default function useModals() {
	return {
		editId,
		editActive,
		deleteId,
		deleteActive,
		openEditModal,
		openDeleteModal,
	}
}
