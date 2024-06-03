export const registeredComponents = new Map<string, any>()

export function registerComponents(components: any) {
  Object.keys(components).forEach(key => {
    registeredComponents.set(key, components[key])
  })
}
