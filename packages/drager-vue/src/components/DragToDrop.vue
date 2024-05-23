<script setup lang="ts">
import {nextTick, onBeforeUnmount, onMounted, ref} from 'vue'
import DtdRecursion from './DtdRecursion.vue'
import DtdItem from './DtdItem.vue'
import { DtdNode, getNode, DragEventType, DragNodeType, ISelectNode} from '@os/drager'
import {useCursor} from "../hooks/useCursor";

defineOptions({
  name: 'DragToDrop',
})

const props = withDefaults(defineProps<{
  data: any[]
  nodeClass?: string
  dragType?: DragNodeType
}>(), {
  dragType: DragNodeType.MOVE
})

const emits = defineEmits(['change'])

const dtdData = ref(new DtdNode({ children: [] }))

const { mouse } = useCursor()

const dragEndHandle = (e: MouseEvent, targetNode?: DtdNode) => {
  if (!mouse.dataTransfer.length) return
  if (targetNode && mouse.dataTransfer.find(node => node.isParentOf(targetNode))) return
  nextTick(() => {
    emits('change', getData())
    dtdData.value = dtdData.value.clone()
    console.log('dragEndHandle', dtdData.value, getData())
  })
  mouse.setSelectedNodes(
    mouse.dataTransfer.map(node => ({ node: getNode(node.dragId), e } as ISelectNode)),
    e,
    targetNode
  );
}
function getData() {
  return DtdNode.toList(dtdData.value)
}

onMounted(() => {
  mouse.on(DragEventType.DragEnd, dragEndHandle)
})
onBeforeUnmount(() => {
  mouse.off(DragEventType.DragEnd, dragEndHandle)
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
  <dtd-item :data="dtdData" :disabled="dtdData.disabled" :class="!dtdData?.children?.length ? 'full' : ''">
    <DtdRecursion :nodeClass :node="dtdData">
      <template #default="{ item }">
        <slot :item="item" />
      </template>
    </DtdRecursion>
  </dtd-item>
</template>

<style scoped>
.full {
  height: 100%;
  width: 100%;
}
</style>