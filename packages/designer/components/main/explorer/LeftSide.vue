<template>
    <os-tabs :options="tabOptions" v-model="activeTabName" />
    <div :class="genCls('designer-left-side')">
        <os-assets v-show="activeTabName === '资产'" :assets="assets" />
        <os-layers v-show="activeTabName === '图层'" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { genCls } from "@oragspatl/dragger-vue";
import OsAssets from "../assets/Index.vue";
import OsLayers from "../layers/Index.vue";
import OsTabs from "./Tabs.vue";

const props = defineProps<{
    assets: any[]
}>()

const tabOptions = ref(['资产', '图层'])
const activeTabName = ref('资产')
</script>

<style lang="scss" scoped>
@use "../../../styles/variables" as *;

.#{$prefix} {
    &-designer-left-side {
        height: calc(100% - var(--os-side-header-height, 40px));
    }
}
</style>