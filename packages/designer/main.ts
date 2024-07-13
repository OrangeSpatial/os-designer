import { createApp } from 'vue'
import Designer from './components/Designer.vue'
import DragToDrop from '@oragspatl/dragger-vue'
import installAntv from './plugins/antv'
import Render from './components/render/Index.vue'

const app = createApp(Designer)
app.use(DragToDrop)
installAntv(app)
app.mount('#app')
