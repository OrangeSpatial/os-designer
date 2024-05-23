<script setup lang="ts">
import { CSSProperties, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  DragEventType,
  DragNodeType,
  DtdNode,
  NodeLayout,
  cursorAtContainerEdge,
  getCursorPositionInDtdNode,
  getLayoutNodeInContainer,
  initStyle
} from '@os/dragger'
import AuxSelection from './selection/Index.vue'
import { useCursor } from "../hooks/useCursor";

const props = withDefaults(defineProps<{
  insertionBgColor?: string
  scrollPosition?: { scrollTop: number, scrollLeft: number }
}>(), {
  insertionBgColor: '#1890ff'
})

const insertionStyle = ref<CSSProperties>()

const draggingCoverRectStyle = ref<CSSProperties>(initStyle)

const droppingCoverRectStyle = ref<CSSProperties>(initStyle)

const auxToolRef = ref<HTMLElement>()
const auxToolStyle = ref<CSSProperties>({
  transform: 'translate(0, 0)',
})

watch(() => props.scrollPosition, (val) => {
  auxToolStyle.value = {
    transform: `translate(${val?.scrollLeft || 0}px, ${val?.scrollTop || 0}px)`
  }
})

const { mouse } = useCursor()
const currentTargetNode = ref<DtdNode>()

function draggingHandler(e: MouseEvent, targetNode?: DtdNode) {

  const positionObj = getCursorPositionInDtdNode(e)
  if (!positionObj || !targetNode || !auxToolRef.value || targetNode.root.dragType === DragNodeType.COPY) {
    resetInsertionStyle()
    resetDraggingCoverRectStyle()
    resetDroppingCoverRectStyle()
    return
  }
  const container = auxToolRef.value.parentElement
  if (!container) return
  const { x: pX, y: pY } = container.getBoundingClientRect()
  const sourceNode = mouse.dataTransfer
  if (!sourceNode?.length) return
  const parentNode = sourceNode.find(node => node.isParentOf(targetNode))
  currentTargetNode.value = targetNode
  const { isTop, isLeft, rect } = positionObj
  const isVertical = getLayoutNodeInContainer(positionObj.targetEl) === NodeLayout.VERTICAL
  const d_x = e.pageX - e.clientX
  const d_y = e.pageY - e.clientY
  const left = d_x + rect.left - pX
  const top = d_y + rect.top - pY

  const x = isVertical ? left : isLeft ? left : left + rect.width
  const y = isVertical ? isTop ? top : top + rect.height : top
  if (targetNode.droppable && !cursorAtContainerEdge(rect, e)) {
    // 在可放置的容器内
    resetInsertionStyle()
    updateDroppingCoverRectStyle(rect, left, top)
  } else if (!parentNode) {
    updateInsertionStyle(rect, x, y, isVertical)
    resetDroppingCoverRectStyle()
  }

  // same source should be a draggingCoverRect
  if (targetNode.root === mouse.dataTransfer?.[0]?.root) {
    updateDraggingCoverRectStyle(d_x, d_y, pX, pY)
  } else {
    resetDraggingCoverRectStyle()
  }
}

function updateInsertionStyle(rect: DOMRect, x: number, y: number, vertical: boolean) {
  insertionStyle.value = {
    transform: `perspective(1px) translate3d(${x - 1}px,${y - 1}px,0px)`,
    width: vertical ? rect.width + 'px' : '2px',
    height: vertical ? '2px' : rect.height + 'px'
  }
}

function updateDraggingCoverRectStyle(dx: number, dy: number, pX: number, pY: number) {
  const dragRect = mouse.dragElement?.getBoundingClientRect()
  if (dragRect) {
    draggingCoverRectStyle.value = {
      transform: `perspective(1px) translate3d(${dx + dragRect.left - pX}px,${dy + dragRect.top - pY}px,0px)`,
      width: dragRect.width + 'px',
      height: dragRect.height + 'px'
    }
  }
}

function updateDroppingCoverRectStyle(dropRect: DOMRect, x: number, y: number) {
  droppingCoverRectStyle.value = {
    transform: `perspective(1px) translate3d(${x}px,${y}px,0px)`,
    width: dropRect.width + 'px',
    height: dropRect.height + 'px'
  }
}

function resetInsertionStyle() {
  insertionStyle.value = {
    top: 0,
    left: 0,
    height: 0,
    width: 0,
    transform: `perspective(1px) translate3d(0px,0px,0px)`,
  }
}

function resetDraggingCoverRectStyle() {
  draggingCoverRectStyle.value = initStyle
}

function resetDroppingCoverRectStyle() {
  droppingCoverRectStyle.value = initStyle
}


function dragEndHandler() {
  resetInsertionStyle()
  resetDraggingCoverRectStyle()
  currentTargetNode.value = undefined
}

onMounted(() => {
  mouse.on(DragEventType.Dragging, draggingHandler)
  mouse.on(DragEventType.DragEnd, dragEndHandler)
})

onBeforeUnmount(() => {
  mouse.on(DragEventType.Dragging, draggingHandler)
  mouse.on(DragEventType.DragEnd, dragEndHandler)
})
</script>

<template>
  <div :style="auxToolStyle" class="dtd-aux-tool" ref="auxToolRef">
    <div class="dtd-aux-insertion" :style="{ ...insertionStyle, backgroundColor: insertionBgColor }"></div>
    <div class="dtd-aux-dashed-box"></div>
    <aux-selection :scrollPosition :parentEl="auxToolRef" />
    <div v-if="mouse.dataTransfer.length" class="dtd-aux-cover-rect dragging" :style="draggingCoverRectStyle"></div>
    <div v-if="currentTargetNode?.droppable" class="dtd-aux-cover-rect dropping" :style="droppingCoverRectStyle"></div>
  </div>
</template>

<style scoped>
.dtd-aux-tool {
  transform: perspective(1px) translateZ(0);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
  z-index: 2;
}

.dtd-aux-insertion {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  transform: perspective(1px);
}

.dtd-aux-cover-rect {
  pointer-events: none;
  position: absolute;
  background-color: rgba(0, 147, 251, 0.1);
  transform: perspective(1px) translateZ(0);
}

.dtd-aux-cover-rect.dragging {
  box-sizing: border-box;
  border: 1px solid #0092fbe1;
}
</style>
