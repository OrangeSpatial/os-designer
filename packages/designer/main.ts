import { createApp } from 'vue'
import Designer from './components/Designer.vue'
import DragToDrop from '@oragspatl/dragger-vue'
import installElementPlus from './plugins/elementPlus'

const app = createApp(Designer)
app.use(DragToDrop)
installElementPlus(app)
app.mount('#app')
