import { VNode, h } from 'vue'
import { registeredComponents } from './registryComponents'

export function schemaRender(
  schema: any,
  dragId?: string
): VNode {
  let children = schema.children
  if (Array.isArray(children)) {
    children =
      schema.children?.map((child: any) =>
        schemaRender(child)
      ) || []
  }
  return h(
    registeredComponents.get(schema.componentName) ||
      schema.componentName,
    {
      ...schema.props,
      key: dragId
    },
    children
  )
}
