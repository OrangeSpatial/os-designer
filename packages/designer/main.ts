import { createApp } from 'vue'
import Designer from './components/Designer.vue'
import DragToDrop from '@oragspatl/dragger-vue'

const app = createApp(Designer)
app.use(DragToDrop)
app.mount('#app')
