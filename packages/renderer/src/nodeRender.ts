import { VNode, h } from 'vue'
import { registeredComponents } from './registryComponents'

export function schemaRender(schema: any, dragId?: string): VNode {
  return h(
    registeredComponents.get(schema.componentName) || schema.componentName,
    {
      ...schema.props,
      key: dragId
    },
    schema.children?.map((child: any) => schemaRender(child)) || []
  )
}
