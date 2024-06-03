<template>
  <div
    class="dtd-aux-helpers"
    :class="[isTouchedTop ? 'bottom-left' : 'top-left']"
  >
    {{ node.selectNode?.dragId }}
  </div>
  <div
    class="dtd-aux-helpers"
    :class="[isTouchedTop ? 'bottom-right' : 'top-right']"
  >
    {{ node.selectNode?.props?.componentName }}
  </div>
</template>

<script lang="ts" setup>
import { DtdNode } from '@oragspatl/dragger'
import { useTheme } from '../../hooks/useTheme'
import { computed } from 'vue'

const props = defineProps<{
  node: {
    selectionStyleTransform: string
    selectNode: DtdNode
  }
}>()

const isTouchedTop = computed(() => {
  const match = props.node.selectionStyleTransform?.match(
    /translate3d\([^,]+,([^,]+),[^,]+\)/
  )
  const translateY = match ? match[1] : '11'
  return parseFloat(translateY) < 10
})

const { theme }: any = useTheme()
</script>

<style scoped>
.dtd-aux-helpers {
  --border-vertical-offset: -30px;
  --border-horizontal-offset: -2px;
  --pad-4: 4px;

  pointer-events: auto;
  position: absolute;
  height: 20px;
  color: v-bind('theme.primaryTextColor');
  background-color: v-bind('theme.primaryColor');
  padding: var(--pad-4);
}

.top-right {
  top: var(--border-vertical-offset);
  right: var(--border-horizontal-offset);
  border-radius: var(--pad-4) var(--pad-4) 0 0;
}

.top-left {
  top: var(--border-vertical-offset);
  left: var(--border-horizontal-offset);
  border-radius: var(--pad-4) var(--pad-4) 0 0;
}

.bottom-right {
  bottom: var(--border-vertical-offset);
  right: var(--border-horizontal-offset);
  border-radius: 0 0 var(--pad-4) var(--pad-4);
}

.bottom-left {
  bottom: var(--border-vertical-offset);
  left: var(--border-horizontal-offset);
  border-radius: 0 0 var(--pad-4) var(--pad-4);
}
</style>
