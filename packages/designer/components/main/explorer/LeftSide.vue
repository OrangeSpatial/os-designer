<template>
    <div :class="genCls('designer-left-side')">
        <os-assets v-show="activeName === 'Assets'" :assets="assets" />
        <os-layers v-show="activeName === 'Layers'" />
    </div>
</template>

<script setup lang="ts">
import { genCls } from "@oragspatl/dragger-vue";
import OsAssets from "../assets/Index.vue";
import OsLayers from "../layers/Index.vue";

const props = defineProps<{
    activeName: string,
    assets: any[]
}>()
</script>

<style lang="scss" scoped>
@use "../../../styles/variables" as *;

.#{$prefix} {
    &-designer-left-side {
        height: calc(100% - var(--os-side-header-height, 40px));
    }
}
</style>