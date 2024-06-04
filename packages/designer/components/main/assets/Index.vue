<template>
    <a-collapse v-model:activeKey="activeKey" ghost>
        <a-collapse-panel v-for="item in Object.keys(categories)" :key="item" :header="item">
            <DragToDrop drag-type="copy" nodeClass="dtd-item" class="dtd-copy-nodes" :data="categories[item]">
                <template #default="{ item }">
                    <div class="copy-item">
                        <div class="dtd-copy-icon"></div>
                        <div class="dtd-node-name">{{ item.props?.componentName }}</div>
                    </div>
                </template>
            </DragToDrop>
        </a-collapse-panel>
    </a-collapse>

</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
    assets: any[]
}>()

const categories = computed(() => {
    return props.assets.reduce((acc, cur) => {
        if (!acc[cur.category]) {
            acc[cur.category] = []
        }
        acc[cur.category].push(cur)
        return acc
    }, {})
})

const activeKey = ref(Object.keys(categories.value))

</script>

<style lang="scss" scoped>
.dtd-copy-nodes {
    :deep(.full) {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
}

:deep(.dtd-item) {
    padding: 4px;
    background-color: white;
    height: 100px;
}

.copy-item {
    border-radius: 2px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
        box-shadow: 0 0px 5px 0 rgba(0, 0, 0, 0.1);
    }

    .dtd-copy-icon {
        flex: 1;
        background-color: #333;
    }

    .dtd-node-name {
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: #333;
    }
}
</style>
