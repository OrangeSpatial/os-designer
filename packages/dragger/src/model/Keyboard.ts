const KEYCODES = {
  command: 'Meta',
  shift: 'Shift',
  option: 'Alt',
  ctrl: 'Control',
  enter: 'Enter'
}

export class Keyboard {
  pressKeys: string[] = []

  isPress(keyCode: string): boolean {
    return this.pressKeys.includes(keyCode)
  }

  isSelecting(): boolean {
    return this.isPress(KEYCODES.command) || this.isPress(KEYCODES.ctrl)
  }

  public keydown = (e: KeyboardEvent) => {
    this.pressKeys.push(e.key)
    document.addEventListener('keyup', this.keyup)
  }
  public keyup = (e: KeyboardEvent) => {
    this.pressKeys = []
    document.removeEventListener('keyup', this.keyup)
  }
}
