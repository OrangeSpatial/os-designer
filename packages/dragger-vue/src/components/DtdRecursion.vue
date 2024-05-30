<script setup lang="ts">
import { DtdNode } from "@oragspatl/dragger";
import DtdItem from "./DtdItem.vue";

defineOptions({
  name: "DtdRecursion",
});
defineSlots<{
  default: { item: DtdNode }
}>()
withDefaults(
  defineProps<{
    node: DtdNode;
    nodeClass?: string;
  }>(),
  {}
);
</script>

<template>
  <dtd-item
    :class="nodeClass ? nodeClass : ''"
    v-for="n in node.children"
    :key="n.dragId"
    :data="n"
    :disabled="n.disabled"
  >
    <slot :item="n"></slot>
    <DtdRecursion :nodeClass v-if="n.children?.length" :node="n">
      <template #default="{ item: node }">
        <slot :item="node"></slot>
      </template>
    </DtdRecursion>
  </dtd-item>
</template>
