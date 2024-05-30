import { Mouse, Keyboard } from '@oragspatl/dragger'
import { onBeforeUnmount, onMounted, provide } from 'vue'
import { DTD_MOUSE } from '../common/injectSymbol'

export function useCursor(keyboard?: Keyboard) {
  const mouse = new Mouse(keyboard)

  provide(DTD_MOUSE, mouse)

  onMounted(() => {
    window.addEventListener('mousedown', mouse.down)
    window.addEventListener('mousemove', mouse.move)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('mousedown', mouse.down)
    window.removeEventListener('mousemove', mouse.move)
  })

  return { mouse }
}
