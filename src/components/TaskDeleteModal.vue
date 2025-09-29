<script setup lang="ts">
import useApp from '@/composables/useApp';
import useModals from '@/composables/useModals';

import BaseModal from './base/BaseModal.vue';

const app = useApp()
const { deleteId, deleteActive } = useModals()

function submitModal() {
	app.tasks.deleteTask(deleteId.value)
}
</script>

<template>
	<BaseModal title="Delete Task" button-color="bg-red-500" button-text="Delete" @submit="submitModal"
		v-model:active="deleteActive">
		<p>Are you sure you want to delete this task? This cannot be undone.</p>
	</BaseModal>
</template>
