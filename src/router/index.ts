import { createRouter, createWebHistory } from 'vue-router'
import useSupabaseAuth from '@/composables/useSupabaseAuth'

import LoginView from '@/views/auth/LoginView.vue'
import SignupView from '@/views/auth/SignupView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import UpdatePasswordView from '@/views/auth/UpdatePasswordView.vue'

import MainGate from '@/views/MainGate.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const supabaseAuth = useSupabaseAuth()

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: MainGate,
		},
		{
			path: '/login',
			name: 'login',
			component: LoginView,
		},
		{
			path: '/signup',
			name: 'signup',
			component: SignupView,
		},
		{
			path: '/forgotpassword',
			name: 'forgotpassword',
			component: ForgotPasswordView,
		},
		{
			path: '/updatepassword',
			name: '/updatepassword',
			component: UpdatePasswordView,
		},

		{
			path: '/:pathMatch(.*)*',
			name: 'notfound',
			component: NotFoundView,
		},
	],
})

router.beforeEach((to) => {
	const updatingPassword = supabaseAuth.updatingPassword.value
	console.log('updating:', updatingPassword, 'going to:', to.path)
	if (!updatingPassword && to.path === '/updatepassword') return '/forgotpassword'
	return true
})
router.beforeEach((to) => {
	const session = supabaseAuth.session.value
	if (session && ['/login', '/signup', '/forgotpassword'].includes(to.path)) return '/'
	return true
})

export default router
