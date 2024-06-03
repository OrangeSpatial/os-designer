<script setup lang="ts">
import {
  DtdNode,
  NodeLayout,
  MouseEventType,
  DragNodeType,
  cursorAtContainerEdge,
  getCursorPositionInDtdNode,
  getLayoutNodeInContainer
} from '@oragspatl/dragger'
import { useCursor } from '../hooks/useCursor'
import DtdGhost from './DtdGhost.vue'
import { onBeforeUnmount, ref, onMounted } from 'vue'
import { useKeyboard } from '../hooks/useKeyboard'

defineOptions({
  name: 'DtdPod'
})

const emits = defineEmits<{
  (e: 'selected', data: any): void
}>()

const podRef = ref<HTMLElement>()
const { keyboard } = useKeyboard()
const { mouse } = useCursor(keyboard)

function dragEndHandler(e: MouseEvent, targetNode?: DtdNode) {
  const sourceNode = mouse.dataTransfer
  const positionObj = getCursorPositionInDtdNode(e)
  carryNode.value = []
  if (!targetNode || !sourceNode.length || !positionObj || !mouse.dragElement)
    return
  const parentNode = sourceNode.find(node => node.isParentOf(targetNode))
  if (parentNode) return
  // COPY组 拖拽不允许插入到容器内
  if (targetNode.root.dragType === DragNodeType.COPY) return
  const dragType = sourceNode[0].root.dragType
  const isContainerEdge = cursorAtContainerEdge(positionObj.rect, e)
  const isVertical =
    getLayoutNodeInContainer(positionObj.targetEl) === NodeLayout.VERTICAL
  const insertBefore = isVertical
    ? positionObj.insertBefore
    : positionObj.isLeft
  mouse.insertNode(
    targetNode,
    sourceNode,
    insertBefore,
    dragType,
    targetNode?.droppable && !isContainerEdge
  )
}

const carryNode = ref<DtdNode[]>([])

function ghostMounted(el: HTMLElement) {
  mouse.setGhostElement(el)
}

function selectHandler() {
  emits('selected', mouse.selectedNodes[0]?.node?.props)
}

function dragStartHandler() {
  carryNode.value = mouse.dataTransfer
}

onMounted(() => {
  if (podRef.value) {
    mouse.setPodElement(podRef.value)
  }
  mouse.on(MouseEventType.Select, selectHandler)
  mouse.on(MouseEventType.DragStart, dragStartHandler)
  mouse.on(MouseEventType.DragEnd, dragEndHandler)
})

onBeforeUnmount(() => {
  mouse.off(MouseEventType.Select, selectHandler)
  mouse.off(MouseEventType.DragStart, dragStartHandler)
  mouse.off(MouseEventType.DragEnd, dragEndHandler)
})
</script>

<template>
  <div ref="podRef" class="dtd-pod">
    <slot></slot>
    <dtd-ghost @mounted="ghostMounted">
      <slot
        name="ghost"
        v-if="carryNode.length"
        :items="carryNode.map(node => node.props)"
      />
    </dtd-ghost>
  </div>
</template>

<style scoped>
.dtd-pod {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
