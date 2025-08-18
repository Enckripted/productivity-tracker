import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import useSupabaseAuth from './composables/supabaseAuth'

const app = createApp(App)
const supabaseAuth = useSupabaseAuth()

await supabaseAuth.getSession()

app.use(router)
app.mount('#app')
