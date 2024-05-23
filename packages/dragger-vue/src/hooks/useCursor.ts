import { Mouse, Keyboard } from '@oragspatl/dragger'
import { onBeforeUnmount, onMounted } from 'vue'

let mouse = new Mouse()

export function initCursor(keyboard: Keyboard) {
  mouse = new Mouse(keyboard)
  onMounted(() => {
    document.addEventListener('mousedown', mouse.down)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', mouse.down)
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
