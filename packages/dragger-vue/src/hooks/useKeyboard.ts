import { onBeforeUnmount, onMounted } from 'vue'
import { Keyboard } from '@os/dragger'

export function useKeyboard() {
  const keyboard = new Keyboard()

  onMounted(() => {
    document.addEventListener('keydown', keyboard.keydown)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', keyboard.keydown)
  })

  return {
    keyboard
  }
}
