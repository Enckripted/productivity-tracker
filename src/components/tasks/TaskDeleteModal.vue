<script setup lang="ts">
import useApp from '@/composables/useApp';
import useModals from '@/composables/useModals';

import ConfirmDangerousModal from '../base/ConfirmDangerousModal.vue';

const app = useApp()
const { taskDeleteModal } = useModals()

function submitModal() {
	app.tasks.deleteTask(taskDeleteModal.id.value)
}
</script>

<template>
	<ConfirmDangerousModal description="Are you sure you want to delete this task? This cannot be undone."
		button-title="Delete" v-model:active="taskDeleteModal.active.value" @submit="submitModal" />
</template>
