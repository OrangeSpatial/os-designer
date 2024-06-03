export const KEYCODES = {
  command: 'Meta',
  shift: 'Shift',
  option: 'Alt',
  ctrl: 'Control',
  enter: 'Enter',
  backspace: 'Backspace',
  delete: 'Delete'
}

export enum KEYBOARD_EVENTS {
  keydown = 'keydown',
  keyup = 'keyup',
  delete = 'delete'
}

export class Keyboard {
  pressKeys: string[] = []

  isPress(keyCode: string): boolean {
    return this.pressKeys.includes(keyCode)
  }

  isSelecting(): boolean {
    return this.isPress(KEYCODES.command) || this.isPress(KEYCODES.ctrl)
  }

  eventCallbacks = new Map<KEYBOARD_EVENTS, Function[]>()

  on(event: KEYBOARD_EVENTS, cb: Function) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, [])
    }
    this.eventCallbacks.get(event)?.push(cb)
  }

  off(event: KEYBOARD_EVENTS, cb: Function) {
    if (!this.eventCallbacks.has(event)) {
      return
    }
    this.eventCallbacks.set(
      event,
      this.eventCallbacks.get(event)?.filter(fn => fn !== cb) || []
    )
  }

  public keydown = (e: KeyboardEvent) => {
    this.pressKeys.push(e.key)
    this.eventCallbacks.get(KEYBOARD_EVENTS.keydown)?.forEach(cb => cb(e))
    if ([KEYCODES.backspace, KEYCODES.delete].includes(e.key)) {
      this.eventCallbacks.get(KEYBOARD_EVENTS.delete)?.forEach(cb => cb(e))
    }
    document.addEventListener('keyup', this.keyup)
  }
  public keyup = (e: KeyboardEvent) => {
    this.pressKeys = []
    this.eventCallbacks.get(KEYBOARD_EVENTS.keyup)?.forEach(cb => cb(e))
    document.removeEventListener('keyup', this.keyup)
  }
}
