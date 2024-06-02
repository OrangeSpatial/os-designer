<template>
    <div :class="genCls('designer-main')">
        <dtd-pod class="dtd-root">
            <DesignerExplorer>
                <DragToDrop drag-type="copy" class="dtd-copy-nodes" :data="assets">
                    <template #default="{ item }">
                        <div class="dtd-item copy-item">{{ item.props?.componentName }}</div>
                    </template>
                </DragToDrop>
                <drag-bar position="end" direction="vertical" :range="[100, 500]"></drag-bar>
            </DesignerExplorer>
            <DesignerWorkspace>
                <DragToDrop class="dtd-render-container" nodeClass="dtd-render-node-class" :data="data1">
                    <template #default="{ item }">
                        <div class="dtd-item">{{ item.props?.componentName }}</div>
                    </template>
                </DragToDrop>
            </DesignerWorkspace>
            <DesignerExplorer>
                <drag-bar position="start" direction="vertical" :range="[100, 500]"></drag-bar>
                right
            </DesignerExplorer>
            <template #ghost="{ items }">
                <div class="ghost-class">{{ items?.[0].componentName }}</div>
            </template>
        </dtd-pod>
    </div>
</template>

<script setup lang="ts">
import { genCls, DragBar } from "@oragspatl/dragger-vue";
import DesignerExplorer from "./explorer/Index.vue";
import DesignerWorkspace from "./workspace/Index.vue";
import { ref } from "vue";

const props = defineProps<{
    assets: any[]
}>()

const data1 = ref([])
</script>

<style lang="scss">
@use "../styles/variables" as *;

.#{$prefix} {
    &-designer-main {
        color: var(--os-operation-color);
        height: calc(100% - var(--os-header-height));

        .dtd-root {
            display: flex;
            justify-content: space-between;

            .dtd-copy-nodes {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .dtd-render-node-class {
                padding: 10px;
                border: 1px solid var(--os-operation-border-color);
            }
            .dtd-render-container {
                background-color: #fff;
            }
        }

        .dtd-item {
            padding: 4px;
            background-color: white;
        }

        .copy-item {
            border-radius: 4px;
            
            &:hover {
                background-color: var(--os-primary-color);
                color: white;
            }
        }

        .node-class {
            background-color: white;
        }

        .ghost-class {
            background-color: var(--os-primary-color);
            color: white;
            padding: 4px;
            border-radius: 4px;
        }
    }
}
</style>