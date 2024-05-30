<template>
    <div :class="genCls('designer-worksapce')">
        <div :class="genCls('designer-worksapce-header')"></div>
        
        <div :class="genCls('designer-worksapce-content')">
            <slot></slot>
        </div>
        <div :class="genCls('designer-worksapce-footer')"></div>
    </div>
</template>

<script setup lang="ts">
import { genCls } from "@oragspatl/dragger-vue";
</script>

<style lang="scss">
@use "../../../styles/variables" as *;

.#{$prefix} {
    &-designer-worksapce {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        flex: 1;
        color: var(--os-workspace-color);
        background-color: var(--os-workspace-bg-color);
    }
    &-designer-worksapce-header {
        height: 28px;
        background-color: #f4f4f4;
    }
    &-designer-worksapce-content {
        flex: 1;
        overflow: auto;
        padding: 10px;
    }
    &-designer-worksapce-footer {
        height: 28px;
        background-color: var(--os-footer-bg-color);
    }
}
</style>