import { VNode, h } from 'vue'
import { registeredComponents } from './registryComponents'

export function schemaRender(
  schema: any | any[]
): VNode | VNode[] | string {
  if (typeof schema === 'string') return schema
  if (Array.isArray(schema)) {
    return schema.map((child: any) =>
      schemaRender(child)
    ) as VNode[]
  } else return renderNode(schema)
}

export function renderNode(node: any): VNode {
  return h(
    registeredComponents.get(node.componentName) ||
      node.componentName,
    {
      ...node.props,
      key: node.dragId
    },
    () => {
      let children = node.children
      if (Array.isArray(children)) {
        children =
          children.map((child: any) => schemaRender(child)) ||
          []
      } else if (typeof children === 'object') {
        const slots = Reflect.ownKeys(children)
        if (slots.length) {
          slots.forEach(slot => {
            children[slot] = () => schemaRender(children[slot])
          })
        } else children = []
      }
      return children
    }
  )
}
