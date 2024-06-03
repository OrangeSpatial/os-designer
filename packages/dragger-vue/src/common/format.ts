const classNamePrefix = 'os'

/**
 * 给类添加前缀
 */
export function prefixCls(prefix: string, className: string): string {
  return `${prefix}-${className}`
}

export function genCls(className: string): string {
  return `${classNamePrefix}-${className}`
}
