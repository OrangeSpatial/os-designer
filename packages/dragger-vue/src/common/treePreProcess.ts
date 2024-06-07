export function treePreProcess(node: any[]): any[] {
  return node.map(child => {
    // droppable
    child.droppable = child.configure?.slots?.find(
      (item: { name: string }) => item.name === 'default'
    )
    const children = child.children?.length
      ? treePreProcess(child.children)
      : undefined
    return {
      ...child,
      children
    }
  })
}
