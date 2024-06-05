<template>
    <div :class="genCls('designer-main')">
        <dtd-pod class="dtd-root" @selected="onSelected">
            <DesignerExplorer>
                <left-side :assets />
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
                <right-side></right-side>
            </DesignerExplorer>
            <template #ghost="{ items }">
                <div class="ghost-class">{{ items?.[0].componentName }}</div>
            </template>
        </dtd-pod>
    </div>
</template>

<script setup lang="ts">
import { genCls, DragBar, DtdNode } from "@oragspatl/dragger-vue";
import DesignerExplorer from "./explorer/Index.vue";
import DesignerWorkspace from "./workspace/Index.vue";
import { provide, ref, watchEffect } from "vue";
import NodeRender from "../render/Index.vue";
import { registerComponents } from "@oragspatl/renderer";
import { antvComponents } from "../../plugins/antv";
import LeftSide from "./explorer/LeftSide.vue";
import RightSide from "./explorer/RightSide.vue";
import { SelectedNodesSymbol } from "../../common/injectSymbol";

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

const data = ref<DtdNode[]>([])

const selectedNodes = ref<DtdNode[]>([])

function onSelected(nodes: DtdNode[]) {
    selectedNodes.value = nodes
}

provide(SelectedNodesSymbol, selectedNodes)
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