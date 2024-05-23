<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
  // 生成20个数据
  ...Array.from({ length: 20 }).map((_, index) => ({
    id: index,
    name: `Item ${index}`,
  }))
])
</script>

<template>
  <div style="padding: 24px; height: calc(100% - 50px);">
    <dtd-pod>
      <DragToDrop nodeClass="node-class" class="dtd-root" :data="data" @change="d => data = d">
        <template #default="{ item }">
          <div class="dtd-item">{{ item.props?.name }}</div>
        </template>
      </DragToDrop>
      <template #ghost="{ items }">
        <div class="ghost-custom">{{ items?.[0].name }}</div>
      </template>
    </dtd-pod>
  </div>
</template>