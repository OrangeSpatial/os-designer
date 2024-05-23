<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
  {
    id: 12,
    name: 'Input',
  },
  {
    id: 13,
    name: 'Button',
  },
  {
    id: 14,
    name: 'Card',
    droppable: true,
    children: [
      {
        id: 15,
        name: 'CardHeader',
      },
      {
        id: 16,
        name: 'CardBody',
      },
      {
        id: 17,
        name: 'CardFooter',
      },
    ],
  }
])
</script>

<template>
  <div style="padding: 24px;">
    <dtd-pod>
      <div>
        <DragToDrop nodeClass="node-class" class="dtd-root flex" :data="data" @change="d => data = d">
          <template #default="{ item }">
            <div class="dtd-item">{{ item.props?.name }}</div>
          </template>
        </DragToDrop>
      </div>
      <template #ghost="{ items }">
        <div class="ghost-custom">{{ items?.[0].name }}</div>
      </template>
    </dtd-pod>
  </div>

  <div class="title">渲染数据：</div>
  <div class="code">
    <pre>{{ data }}</pre>
  </div>
</template>
