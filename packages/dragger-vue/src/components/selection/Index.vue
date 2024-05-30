<script setup lang="ts">
import { CSSProperties, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  DTD_BASE_KEY, initStyle,
  MouseEventType,
  DtdNode,
  cursorAtContainerEdge,
  getCursorPositionInDtdNode,
  getElementByDtdId, ISelectNode,
  Mouse
} from '@oragspatl/dragger'
import { DTD_MOUSE } from '../../common/injectSymbol';

defineOptions({
  name: 'AuxSelection'
})

const props = withDefaults(defineProps<{
  parentEl?: HTMLElement;
  scrollPosition: { scrollTop: number, scrollLeft: number };
}>(), {
  scrollPosition: () => ({ scrollTop: 0, scrollLeft: 0 })
})

const selectNodes = ref<{
  selectionStyle: CSSProperties;
  selectNode: DtdNode;
  startPosition: { x: number; y: number };
  startLeft: number;
  startTop: number;
}[]>([])

const mouse = inject<Mouse>(DTD_MOUSE)

function selectHandler(e?: MouseEvent, targetNode?: DtdNode) {
  selectNodes.value = []
  mouse?.selectedNodes.forEach((selectNode: ISelectNode) => {
    selectNodes.value.push({
      selectNode: selectNode.node,
      selectionStyle: initStyle,
      startPosition: { x: props.scrollPosition.scrollLeft, y: props.scrollPosition.scrollTop },
      startLeft: 0,
      startTop: 0
    })
    nextTick(() => {
      updateSelection(selectNode.e, targetNode)
    })
  })
}

function updateSelection(e?: MouseEvent, targetNode?: DtdNode) {
  if (!e) {
    resetSelectionRectStyle()
    return
  }
  const positionObj = getCursorPositionInDtdNode(e)
  if (!mouse?.selectedNodes.length) {
    resetSelectionRectStyle()
    return
  }
  // aux dom
  const container = props.parentEl?.parentElement
  if (!container) return
  // 容器偏移量
  const { x: offsetX, y: offsetY } = container.getBoundingClientRect()
  // 节点对应的dom
  let selectedDoms: (Element | null)[]

  if (targetNode && positionObj) {
    // 拖拽
    // 选中拖拽节点
    const isContainerEdge = cursorAtContainerEdge(positionObj.rect, e)
    // 获取所有拖拽节点对应的dom
    // 如果是放入容器，在容器内计算最大矩形
    if (targetNode?.droppable && !isContainerEdge) {
      // 在可放置的容器内
      selectedDoms = selectNodes.value.map(item => {
        return getElementByDtdId(item.selectNode.dragId, positionObj.targetEl)
      })
    } else {
      // 如果不是放入容器，计算所有拖拽节点父级dom的最大矩形
      const parentDtdDom = positionObj.targetEl.parentElement?.closest(`[${DTD_BASE_KEY}]`) as HTMLElement
      if (!parentDtdDom) return
      selectedDoms = selectNodes.value.map(item => {
        return getElementByDtdId(item.selectNode.dragId, parentDtdDom)
      })
    }
  } else {
    selectedDoms = selectNodes.value.map(item => {
      return getElementByDtdId(item.selectNode.dragId, container)
    })
  }
  // 计算所有拖拽节点对应的dom的最大矩形
  if (!selectedDoms?.length) return
  selectedDoms.map((dom, index) => {
    const rect = dom?.getBoundingClientRect()
    if (!rect) return
    const left = rect.left - offsetX - props.scrollPosition.scrollLeft
    const top = rect.top - offsetY - props.scrollPosition.scrollTop
    const width = rect.width
    const height = rect.height
    selectNodes.value[index].startLeft = left
    selectNodes.value[index].startTop = top
    selectNodes.value[index].selectionStyle = {
      transform: `translate3d(${left}px,${top}px,0px)`,
      width: width + 'px',
      height: height + 'px',
      borderWidth: '2px'
    }
  })
}

function resetSelectionRectStyle() {
  selectNodes.value = []
}

function updateSelectionRectStyle() {
  selectNodes.value.map(item => {
    const dx = props.scrollPosition.scrollLeft - item.startPosition.x
    const dy = props.scrollPosition.scrollTop - item.startPosition.y
    const left = item.startLeft - dx
    const top = item.startTop - dy
    item.selectionStyle = {
      ...item.selectionStyle,
      transform: `translate3d(${left}px,${top}px,0px)`
    }
  })
}

watch(() => props.scrollPosition, () => {
  updateSelectionRectStyle()
}, { deep: true })

onMounted(() => {
  mouse?.on(MouseEventType.Select, selectHandler)
})
onBeforeUnmount(() => {
  mouse?.off(MouseEventType.Select, selectHandler)
})

defineExpose({
  selectHandler
})
</script>

<template>
  <div v-for="(item) in selectNodes" :key="item.selectNode.dragId" class="dtd-aux-selection-box"
       :style="item.selectionStyle">
       <slot v-if="selectNodes.length === 1" :item="item.selectNode" />
  </div>
</template>

<style scoped>
.dtd-aux-selection-box {
  position: absolute;
  pointer-events: none;
  z-index: 999;
  box-sizing: border-box;
  transform: perspective(1px) translateZ(0);
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border: 0px solid #0092fbe1;
}
</style>