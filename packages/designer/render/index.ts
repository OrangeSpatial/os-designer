import { DtdNode } from '@oragspatl/dragger'

export function renderDtdNode (node: DtdNode) {
  const el = document.createElement('div')
  el.setAttribute(DTD_BASE_KEY, node.dragId)
  el.classList.add('dtd-node')
  el.innerHTML = node.props.text
  parent.appendChild(el)
  node.children.forEach(child => renderDtdNode(child, el))
}