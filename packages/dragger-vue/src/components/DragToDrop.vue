<script setup lang="ts">
import { inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import DtdRecursion from './DtdRecursion.vue'
import DtdItem from './DtdItem.vue'
import DtdAuxTool from './DtdAuxTool.vue'
import { DtdNode, getNode, MouseEventType, DragNodeType, ISelectNode, Mouse } from '@oragspatl/dragger'
import { cursorAtContainerEdgeType } from '@oragspatl/dragger'
import { DTD_MOUSE } from '../common/injectSymbol'

defineOptions({
  name: 'DragToDrop'
})

const props = withDefaults(defineProps<{
  data: any[]
  nodeClass?: string
  dragType?: DragNodeType
}>(), {
  dragType: DragNodeType.MOVE
})

const rootRef = ref<HTMLElement>()

const emits = defineEmits(['change'])

const dtdData = ref(new DtdNode({ children: [] }))

const mouse = inject<Mouse>(DTD_MOUSE)

const dragEndHandle = (e: MouseEvent, targetNode?: DtdNode) => {
  if (!mouse?.dataTransfer.length) return
  if (targetNode && mouse?.dataTransfer.find((node: DtdNode) => node.isParentOf(targetNode))) return
  nextTick(() => {
    emits('change', getData())
    dtdData.value = dtdData.value.clone()
    mouse?.setSelectedNodes(
      mouse?.dataTransfer.map((node: DtdNode) => ({ node: getNode(node.dragId), e } as ISelectNode)),
      e,
      targetNode
    )
  })
}

const scrollPosition = ref({ scrollTop: 0, scrollLeft: 0 })

function podScrollHandler(e: Event) {
  const target = e.target as HTMLElement
  if (rootRef.value !== target) return
  scrollPosition.value = {
    scrollTop: target.scrollTop,
    scrollLeft: target.scrollLeft
  }
}

function getData() {
  return DtdNode.toList(dtdData.value)
}

function draggingHandler(e: MouseEvent) {
  const edgeType = cursorAtContainerEdgeType(rootRef.value!, e)
  if (edgeType === 'top') {
    rootRef.value!.scrollTop -= 10
  } else if (edgeType === 'bottom') {
    rootRef.value!.scrollTop += 10
  } else if (edgeType === 'left') {
    rootRef.value!.scrollLeft -= 10
  } else if (edgeType === 'right') {
    rootRef.value!.scrollLeft += 10
  }
}

onMounted(() => {
  if (rootRef.value) {
    rootRef.value.addEventListener('scroll', podScrollHandler)
    // 禁用右键菜单
    rootRef.value.oncontextmenu = () => false
  }
  mouse?.on(MouseEventType.DragEnd, dragEndHandle)
  // 拖拽中，如果拖拽至顶部或底部，左右边缘，自动滚动
  mouse?.on(MouseEventType.Dragging, draggingHandler)
})
onBeforeUnmount(() => {
  if(rootRef.value) {
    rootRef.value.removeEventListener('scroll', podScrollHandler)
  }
  mouse?.off(MouseEventType.DragEnd, dragEndHandle)
  mouse?.off(MouseEventType.Dragging, draggingHandler)
  DtdNode.clearCacheAll()
})

function init() {
  const root = DtdNode.fromList(props.data || [])
  root.dragType = props.dragType
  dtdData.value = root
}

init()

defineExpose({
  getData
})
</script>

<template>
  <div ref="rootRef" class="dtd-render-root">
    <dtd-item :data="dtdData" :disabled="dtdData.disabled" :class="!dtdData?.children?.length ? 'full' : ''">
      <DtdRecursion :nodeClass :node="dtdData">
        <template #default="{ item }">
          <slot :item="item" />
        </template>
      </DtdRecursion>
      <dtd-aux-tool v-if="dtdData.dragType===DragNodeType.MOVE" :scrollPosition />
    </dtd-item>
  </div>
</template>

<style scoped>
.dtd-render-root {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
}

.full {
  height: 100%;
  width: 100%;
}
</style>