<script setup lang="ts">
import { DtdNode } from "@os/dragger";
import DtdItem from "./DtdItem.vue";

defineOptions({
  name: "DtdRecursion",
});

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
      <!-- @ts-ignore is not working 😭-->
      <template #default="slotValue">
        <slot :item="slotValue.item"></slot>
      </template>
    </DtdRecursion>
  </dtd-item>
</template>
