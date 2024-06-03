<template>
    <div :class="genCls('designer-main')">
        <dtd-pod class="dtd-root">
            <DesignerExplorer>
                <os-tabs :options="tabOptions" v-model="activeTabName" />
                <os-assets v-show="activeTabName === 'Assets'" :assets="assets" />
                <os-layers v-show="activeTabName === 'Layers'" />
                <drag-bar position="end" direction="vertical" :range="[100, 500]"></drag-bar>
            </DesignerExplorer>
            <DesignerWorkspace>
                <DragToDrop class="dtd-render-container" nodeClass="dtd-render-node-class" :data="data">
                    <template #default="{ item }">
                        <NodeRender :schema="item.props.schema" />
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
import { ref, watchEffect } from "vue";
import NodeRender from "../render/Index.vue";
import { registerComponents } from "@oragspatl/renderer";
import { antvComponents } from "../../plugins/antv";
import OsAssets from "./assets/Index.vue";
import OsLayers from "./layers/Index.vue";
import OsTabs from "./explorer/Tabs.vue";

const props = defineProps<{
    assets: any[]
}>()

watchEffect(() => {
    const components = props.assets.reduce((acc, cur) => {
        acc[cur.componentName] = antvComponents[cur.componentName]
        return acc
    }, {})
    registerComponents(components)
})

const data = ref([])

const tabOptions = ref(['Assets', 'Layers'])
const activeTabName = ref('Assets')

</script>

<style lang="scss">
@use "../styles/variables" as *;

.#{$prefix} {
    &-designer-main {
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
                // border: 1px solid var(--os-operation-border-color);
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