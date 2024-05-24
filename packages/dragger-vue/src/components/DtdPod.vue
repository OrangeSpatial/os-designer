<script setup lang="ts">
import {
  DtdNode, NodeLayout, insertNode, insertNodeInContainer, DragEventType, DragNodeType, cursorAtContainerEdge,
  cursorAtContainerEdgeType,
  getCursorPositionInDtdNode,
  getLayoutNodeInContainer
} from '@oragspatl/dragger'
import { initCursor } from '../hooks/useCursor'
import DtdAuxTool from './DtdAuxTool.vue'
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
const mouse = initCursor(keyboard)

function dragEndHandler(e: MouseEvent, targetNode?: DtdNode) {
  const sourceNode = mouse.dataTransfer
  const positionObj = getCursorPositionInDtdNode(e)
  carryNode.value = []
  if (!targetNode || !sourceNode.length || !positionObj || !mouse.dragElement) return
  const parentNode = sourceNode.find(node => node.isParentOf(targetNode))
  if (parentNode) return
  // COPY组 拖拽不允许插入到容器内
  if (targetNode.root.dragType === DragNodeType.COPY) return
  const dragType = sourceNode[0].root.dragType
  const isContainerEdge = cursorAtContainerEdge(positionObj.rect, e)
  const isVertical = getLayoutNodeInContainer(positionObj.targetEl) === NodeLayout.VERTICAL
  const insertBefore = isVertical ? positionObj.insertBefore || positionObj.isTop : positionObj.isLeft
  if (targetNode?.droppable && !isContainerEdge) {
    insertNodeInContainer(targetNode, sourceNode, insertBefore, dragType)
  } else {
    insertNode(targetNode, sourceNode, insertBefore, dragType)
  }
}

const carryNode = ref<DtdNode[]>([])

function ghostMounted(el: HTMLElement) {
  mouse.setGhostElement(el)
}

const scrollPosition = ref({ scrollTop: 0, scrollLeft: 0 })

function podScrollHandler(e: Event) {
  const target = e.target as HTMLElement
  if (podRef.value !== target) return
  scrollPosition.value = {
    scrollTop: target.scrollTop,
    scrollLeft: target.scrollLeft
  }
}

function selectHandler() {
  emits('selected', mouse.selectedNodes[0]?.node?.props)
}

function draggingHandler(e: MouseEvent) {
  const edgeType = cursorAtContainerEdgeType(podRef.value!, e)
  if (edgeType === 'top') {
    podRef.value!.scrollTop -= 10
  } else if (edgeType === 'bottom') {
    podRef.value!.scrollTop += 10
  } else if (edgeType === 'left') {
    podRef.value!.scrollLeft -= 10
  } else if (edgeType === 'right') {
    podRef.value!.scrollLeft += 10
  }
}

function dragStartHandler() {
  carryNode.value = mouse.dataTransfer
}

onMounted(() => {
  if (podRef.value) {
    mouse.setPodElement(podRef.value)
    podRef.value.addEventListener('scroll', podScrollHandler)
  }
  mouse.on(DragEventType.Select, selectHandler)
  mouse.on(DragEventType.DragStart, dragStartHandler)
  // 拖拽中，如果拖拽至顶部或底部，左右边缘，自动滚动
  mouse.on(DragEventType.Dragging, draggingHandler)
  mouse.on(DragEventType.DragEnd, dragEndHandler)
})

onBeforeUnmount(() => {
  mouse.off(DragEventType.Select, selectHandler)
  mouse.off(DragEventType.DragStart, dragStartHandler)
  mouse.off(DragEventType.Dragging, draggingHandler)
  mouse.off(DragEventType.DragEnd, dragEndHandler)
  if (podRef.value) {
    podRef.value.removeEventListener('scroll', podScrollHandler)
  }
})
</script>

<template>
  <div ref="podRef" class="dtd-pod">
    <slot></slot>
    <dtd-aux-tool :scrollPosition />
    <dtd-ghost @mounted="ghostMounted">
      <slot name="ghost" v-if="carryNode.length" :items="carryNode.map(node => node.props)" />
    </dtd-ghost>
  </div>
</template>

<style scoped>
.dtd-pod {
  position: relative;
  height: 100%;
  overflow: auto;
}
</style>

