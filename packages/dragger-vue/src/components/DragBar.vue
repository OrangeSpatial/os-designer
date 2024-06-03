<template>
  <div
    v-if="position && direction"
    ref="dragBar"
    class="drag-bar"
    :class="{
      horizontal: direction === 'horizontal',
      vertical: direction === 'vertical'
    }"
    :style="dragBarStyle"
    @mousedown="onMouseDown"
  ></div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted, onUnmounted, inject } from 'vue'
import { MouseEventType, CursorStatus, Mouse } from '@oragspatl/dragger'
import { DTD_MOUSE } from '../common/injectSymbol'
import { useTheme } from '../hooks/useTheme'

interface DragBarProps {
  direction: 'horizontal' | 'vertical'
  position: 'start' | 'end'
  range: [number, number]
}
const props = withDefaults(defineProps<DragBarProps>(), {
  range: [0, Infinity] as any
})
const { theme }: any = useTheme()
const dragBar = ref<HTMLElement | null>(null)

const mouse = inject<Mouse>(DTD_MOUSE)
const startDrag = ref(false)

const dragBarStyle = computed(() => {
  const defaultStyle = {
    backgroundColor: theme.value.primaryColor
  }
  if (props.direction === 'horizontal') {
    return {
      ...(startDrag.value ? defaultStyle : {}),
      top: props.position === 'start' ? 0 : undefined,
      bottom: props.position === 'end' ? 0 : undefined
    }
  } else if (props.direction === 'vertical') {
    return {
      ...(startDrag.value ? defaultStyle : {}),
      left: props.position === 'start' ? 0 : undefined,
      right: props.position === 'end' ? 0 : undefined
    }
  }
})

const startPostion = reactive({ x: 0, y: 0, width: 0, height: 0 })
const onMouseDown = (event: MouseEvent) => {
  if (dragBar.value && mouse?.dragStatus === CursorStatus.Normal) {
    mouse?.setDragStatus(CursorStatus.Resizing)
    startDrag.value = true
    dragBar.value.style.zIndex = '2'
    startPostion.x = event.clientX
    startPostion.y = event.clientY
    const parent = dragBar.value.parentElement
    if (parent) {
      const computedStyle = window.getComputedStyle(parent)
      startPostion.width = parseFloat(computedStyle.width) || parent.offsetWidth
      startPostion.height =
        parseFloat(computedStyle.height) || parent.offsetHeight
    }
  }
}

const onMouseMove = (event: MouseEvent) => {
  if (!dragBar.value || !startDrag.value) return
  // prevent text selection
  window.getSelection()?.removeAllRanges()
  const parent = dragBar.value.parentElement
  if (!parent) return
  let dx = 0
  let dy = 0
  dx = event.clientX - startPostion.x
  dy = event.clientY - startPostion.y

  const calculations = {
    horizontal: {
      start: (dy: number) => startPostion.height - dy,
      end: (dy: number) => startPostion.height + dy
    },
    vertical: {
      start: (dx: number) => startPostion.width - dx,
      end: (dx: number) => startPostion.width + dx
    }
  }

  const dimension = props.direction === 'horizontal' ? 'height' : 'width'
  const change = props.direction === 'horizontal' ? dy : dx

  const parentWidth = calculations[props.direction][props.position](change)
  parent.style[dimension] =
    Math.min(Math.max(parentWidth, props.range[0]), props.range[1]) + 'px'
}

const onMouseUp = () => {
  if (mouse?.dragStatus === CursorStatus.Resizing) {
    mouse?.setDragStatus(CursorStatus.Normal)
  }
  if (dragBar.value) {
    startDrag.value = false
    dragBar.value.style.zIndex = '1'
  }
}

onMounted(() => {
  mouse?.on(MouseEventType.Up, onMouseUp)
  mouse?.on(MouseEventType.Move, onMouseMove)
})

onUnmounted(() => {
  mouse?.off(MouseEventType.Up, onMouseUp)
  mouse?.off(MouseEventType.Move, onMouseMove)
})
</script>

<style scoped>
.drag-bar {
  position: absolute;
  z-index: 1;
}

.drag-bar:hover {
  z-index: 2;
  background-color: v-bind('theme.primaryColor');
}

.horizontal {
  left: 0;
  right: 0;
  height: 2px;
  cursor: ns-resize;
}

.vertical {
  width: 2px;
  top: 0;
  bottom: 0;
  cursor: ew-resize;
}
</style>
