import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import DragToDrop from '@oragspatl/dragger-vue'

const app = createApp(App)
app.use(DragToDrop)
app.mount('#app')
