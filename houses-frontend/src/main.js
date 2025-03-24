import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// ...existing code...

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
// ...existing code...
app.mount('#app')