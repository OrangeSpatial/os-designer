export function isMac() {
  navigator.platform.indexOf('Mac') === 0 || navigator.platform === 'iPhone'
}

export function isWindows() {
  navigator.platform.indexOf('Win') === 0
}
