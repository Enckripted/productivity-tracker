<script setup lang="ts">
import { ref, computed } from "vue"
import useSupabaseAuth from '@/composables/useSupabaseAuth';

import AuthLink from '@/components/auth/AuthLink.vue';

const supabaseAuth = useSupabaseAuth()

const email = ref("")

const errorMsg = ref("")
const success = ref(false)
const submitting = ref(false)

const buttonStyling = computed(() => [
  "mt-2 p-0.5 px-3 text-black rounded-xs cursor-pointer",
  submitting.value ? "bg-gray-200" : "bg-white"
])

async function submitResetForm() {
  submitting.value = true

  const { error } = await supabaseAuth.forgotPassword(email.value)

  if (error) {
    errorMsg.value = error.message
    success.value = false
  } else {
    success.value = true
  }

  submitting.value = false
}
</script>

<template>
  <div class="flex flex-col w-sm h-screen mx-auto justify-center gap-2">
    <h1 class="text-4xl font-bold">Forgot Password</h1>

    <form class="flex flex-col gap-0.5 items-start">
      <div class="flex flex-col w-full">
        <label>Email:</label>
        <input class="w-full border-1 border-white rounded-xs" type="email" v-model="email" />
      </div>
      <button :class="buttonStyling" @click.prevent="submitResetForm">Send Reset Link</button>
    </form>

    <p v-if="success" class="text-green-600">A password reset email has been sent to your inbox.</p>
    <p v-else-if="errorMsg" class="text-red-600">{{ errorMsg }}</p>

    <div>
      <span>Remember your password? </span>
      <AuthLink to="/login">Click here to login.</AuthLink>
    </div>
  </div>
</template>
