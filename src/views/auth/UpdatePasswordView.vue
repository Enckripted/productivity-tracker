<script setup lang="ts">
import { ref, computed } from "vue"
import useSupabaseAuth from "@/composables/useSupabaseAuth"

import AuthLink from "@/components/auth/AuthLink.vue"

const supabaseAuth = useSupabaseAuth()

const password = ref("")

const errorMsg = ref("")
const submitting = ref(false)

const buttonStyling = computed(() => [
  "mt-2 p-0.5 px-3 text-black rounded-xs cursor-pointer",
  submitting.value ? "bg-gray-200" : "bg-white"
])

async function submitUpdateForm() {
  submitting.value = true

  const { error } = await supabaseAuth.updatePassword(password.value)

  if (error) {
    errorMsg.value = error.message
  }
  submitting.value = false
}
</script>

<template>
  <div class="flex flex-col w-sm h-screen mx-auto justify-center gap-2">
    <h1 class="text-4xl font-bold">Reset Password</h1>

    <form class="flex flex-col gap-0.5 items-start">
      <div class="flex flex-col w-full">
        <label>New Password:</label>
        <input class="w-full border-1 border-white rounded-xs" type="password" v-model="password" />
      </div>

      <button :class="buttonStyling" @click.prevent="submitUpdateForm">
        Update Password
      </button>
    </form>

    <p v-if="errorMsg" class="text-red-600">{{ errorMsg }}</p>

    <div>
      <span>Change your mind? </span>
      <AuthLink to="/">Click here to cancel.</AuthLink>
    </div>
  </div>
</template>
