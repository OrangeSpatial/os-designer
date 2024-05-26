import { Mouse, Keyboard } from '@oragspatl/dragger'
import { onBeforeUnmount, onMounted } from 'vue'

let mouse = new Mouse()

export function initCursor(keyboard: Keyboard) {
  mouse = new Mouse(keyboard)
  onMounted(() => {
    window.addEventListener('mousedown', mouse.down)
    window.addEventListener('mousemove', mouse.move)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('mousedown', mouse.down)
    window.removeEventListener('mousemove', mouse.move)
  })

  return mouse
}

export function useCursor() {
  return {
    mouse,
    selectedNodes: mouse.selectedNodes
  }
}

export const keyboard = mouse.keyboard
