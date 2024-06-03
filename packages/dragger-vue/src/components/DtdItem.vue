<script setup lang="ts">
import { computed } from 'vue'
import { DTD_BASE_KEY } from '@oragspatl/dragger'
import { DragToDropItemProps } from '../types/dtdProps'

const props = defineProps<DragToDropItemProps>()
const customProps = computed(() => {
  return {
    [DTD_BASE_KEY]: props.disabled ? undefined : props.data.dragId
  }
})
</script>

<template>
  <div
    v-bind="customProps"
    :class="{
      'drag-disabled': disabled
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.drag-disabled {
  opacity: 0.5;
}
</style>
