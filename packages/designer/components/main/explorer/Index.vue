<template>
    <div :class="genCls('designer-explorer')">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { genCls } from "@oragspatl/dragger-vue";
</script>

<style lang="scss">
@use "../../../styles/variables" as *;

.#{$prefix} {
    &-designer-explorer {
        background-color: var(--os-operation-bg-color);
        width: var(--os-operation-sidebar-width);
        padding: 10px;
    }
}
</style>