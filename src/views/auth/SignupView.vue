<script setup lang="ts">
import { ref, computed } from "vue"
import useSupabaseAuth from '@/composables/supabaseAuth';

import AuthLink from '@/components/auth/AuthLink.vue';

const supabaseAuth = useSupabaseAuth()

const email = ref("")
const password = ref("")

const errorMsg = ref("")
const submitting = ref(false)
const success = ref(false)

const buttonStyling = computed(() => [
  "mt-2 p-0.5 px-3 text-black rounded-xs cursor-pointer",
  submitting.value ? "bg-gray-600" : "bg-white"
])

async function submitSignupForm() {
  submitting.value = true
  const { error } = await supabaseAuth.signup(email.value, password.value)

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
    <h1 class="text-4xl font-bold">Sign Up</h1>

    <form class="flex flex-col gap-0.5 items-start">
      <div class="flex flex-col w-full">
        <label>Email:</label>
        <input class="w-full border-1 border-white rounded-xs" type="text" v-model="email" />
      </div>
      <div class="flex flex-col w-full">
        <label>Password:</label>
        <input class="w-full border-1 border-white rounded-xs" type="password" v-model="password" />
      </div>
      <button :class="buttonStyling" @click.prevent="submitSignupForm">Sign Up</button>
    </form>

    <p v-if="success" class="text-green-600">An email to confirm your signup has been sent to {{ email }}</p>
    <p v-else-if="errorMsg" class="text-red-600">{{ errorMsg }}</p>

    <div>
      <span>Already have an account? </span>
      <AuthLink to="/login">Click here to log in.</AuthLink>
    </div>
  </div>
</template>
