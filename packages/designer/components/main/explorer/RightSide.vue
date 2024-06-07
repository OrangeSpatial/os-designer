<template>
    <div :class="genCls('designer-right-side')">
        <os-tabs :options="tabOptions" v-model="activeTabName" />
        <div>{{ currentNode.props?.componentName }}</div>
        <div v-for="item in currentNode.props?.configure.props || []" :key="item.name">
            <div>{{ item.title }}: {{ item.name }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, Ref } from "vue";
import { genCls } from "@oragspatl/dragger-vue";
import OsTabs from "./Tabs.vue";
import { SelectedNodesSymbol } from "../../../common/injectSymbol";
import { ISelectNode } from "../../../types/node";

const tabOptions = ref(['属性', '事件'])
const activeTabName = ref('属性')

const currentNode = computed(() => selectedNodes.value[0]?.node || {})

const selectedNodes = inject<Ref<ISelectNode[]>>(SelectedNodesSymbol, ref([]))
</script>

<style lang="scss">
@use "../../../styles/variables" as *;

.#{$prefix} {
    &-designer-right-side {
        height: 100%;
    }
}
</style>