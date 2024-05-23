import { withInstall } from './common/install'
import dtd from './components/DragToDrop.vue'
import DtdPod from './components/DtdPod.vue'

export * from './types'
export * from './hooks'
export const DragToDrop = withInstall(dtd, {
  DtdPod
})

export default DragToDrop
