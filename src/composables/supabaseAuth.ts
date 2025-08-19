import { ref, type Ref } from 'vue'
import { createClient, type Session } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const session: Ref<Session | null> = ref(null)
const updatingPassword = ref(false)

supabase.auth.onAuthStateChange((eventType, sessionValue) => {
	console.log(eventType)
	if (eventType === 'PASSWORD_RECOVERY') updatingPassword.value = true
	session.value = sessionValue
})

async function getSession() {
	session.value = (await supabase.auth.getSession()).data.session
}

async function login(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email: email,
		password: password,
	})
	console.log(data, error)
	return { error }
}

async function logout() {
	const { error } = await supabase.auth.signOut()
	//hack - sign out just doesnt work sometimes
	localStorage.removeItem('sb-localhost-auth-token')
	return { error }
}

async function signup(email: string, password: string) {
	const { error } = await supabase.auth.signUp({
		email: email,
		password: password,
	})
	return { error }
}

async function forgotPassword(email: string) {
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: 'http://localhost:5173/updatepassword',
	})
	return { error }
}

async function updatePassword(password: string) {
	const { error } = await supabase.auth.updateUser({
		password: password,
	})
	return error
}

export default function useSupabaseAuth() {
	return {
		session,
		updatingPassword,
		getSession,
		login,
		logout,
		signup,
		forgotPassword,
		updatePassword,
	}
}
