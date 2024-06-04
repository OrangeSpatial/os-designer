<template>
    <div :class="genCls('designer-right-side')">
    </div>
</template>

<script setup lang="ts">
import { genCls } from "@oragspatl/dragger-vue";
</script>

<style lang="scss">
@use "../../../styles/variables" as *;

.#{$prefix} {
    &-designer-left-side {
        height: calc(100% - var(--os-side-header-height, 40px));
    }
}
</style>