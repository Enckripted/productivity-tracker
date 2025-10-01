<script setup lang="ts">
import useApp from '@/composables/useApp';
import useModals from '@/composables/useModals';

import ConfirmDangerousModal from '../base/ConfirmDangerousModal.vue';

const app = useApp()
const { goalDeleteModal } = useModals()

function submitModal() {
	app.goals.deleteGoal(goalDeleteModal.id.value)
}
</script>

<template>
	<ConfirmDangerousModal description="Are you sure you want to delete this goal? This cannot be undone."
		button-title="Delete" @submit="submitModal" v-model:active="goalDeleteModal.active.value" />
</template>
