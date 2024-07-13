<template>
    <div :class="genCls('designer-main')">
        <dtd-pod class="dtd-root" @selected="onSelected">
            <DesignerExplorer>
                <left-side :assets />
                <drag-bar position="end" direction="vertical" :range="[240, 500]"></drag-bar>
            </DesignerExplorer>
            <DesignerWorkspace>
                <DragToDrop class="dtd-render-container" nodeClass="dtd-render-node-class" @change="renderDataChamnge"
                    :data="data">
                    <NodeRender :schema="data" />
                </DragToDrop>
            </DesignerWorkspace>
            <DesignerExplorer>
                <drag-bar position="start" direction="vertical" :range="[240, 500]"></drag-bar>
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
import { vNode } from "../../types/node";

const props = defineProps<{
    assets: any[]
}>()

watchEffect(() => {
    const components = props.assets.reduce((acc, cur) => {
        acc[cur.componentName] = antvComponents[cur.componentName] || cur.componentName
        return acc
    }, {})
    registerComponents(components)
})

function vNodesToObjChildren(vNodes: DtdNode[]) {
    return vNodes.reduce((acc, cur) => {
        if (cur.slotName) {
            if (!acc[cur.slotName]) {
                acc[cur.slotName] = [nodeToSchema(cur)]
            } else {
                acc[cur.slotName].push(nodeToSchema(cur))
            }
        } else {
            if (!acc.default) {
                acc.default = [nodeToSchema(cur)]
            } else {
                if (!Array.isArray(acc.default)) {
                    acc.default = [acc.default]
                }
                acc.default.push(nodeToSchema(cur))
            }
        }
        return acc
    }, {} as Record<string, vNode[]>)
}

function nodeToSchema(node: DtdNode): vNode {
    return {
        id: node.dragId,
        componentName: node.componentName,
        props: node.props,
        children: vNodesToObjChildren(node.children)
    }
}

const data = ref<DtdNode>()

const selectedNodes = ref<DtdNode[]>([])

function onSelected(nodes: DtdNode[]) {
    selectedNodes.value = nodes
}

function renderDataChamnge(val: DtdNode) {
    data.value = val
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