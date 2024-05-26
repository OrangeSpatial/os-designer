<template>
    <div :class="genCls('designer-root')">
        <DesignerHeader />
        <DesignerMain />
    </div>
</template>

<script setup lang="ts">
import { genCls } from "@oragspatl/dragger-vue";
import DesignerHeader from "./header/DesignerHeader.vue";
import DesignerMain from "./main/DesignerMain.vue";
import "../styles/index"
</script>

<style lang="scss">
@use "../styles/variables" as *;

.#{$prefix} {
    &-designer-root {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
}
</style>