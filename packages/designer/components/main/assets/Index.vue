<template>
    <DragToDrop drag-type="copy" class="dtd-copy-nodes" :data="assets">
        <template #default="{ item }">
            <div class="dtd-item copy-item">{{ item.props?.componentName }}</div>
        </template>
    </DragToDrop>
</template>

<script setup lang="ts">

const props = defineProps<{
    assets: any[]
}>()

</script>