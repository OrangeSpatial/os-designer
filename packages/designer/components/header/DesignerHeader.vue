<template>
    <div :class="genCls('designer-header')">
        <div :class="genCls('designer-header-left')">
            <div :class="genCls('designer-header-logo')">
                <div class="logo"></div>
            </div>
            <DesignerToolbar />
        </div>
        <div :class="genCls('designer-header-center')">
            Page Title
        </div>
        <div :class="genCls('designer-header-right')">
        </div>
    </div>
</template>

<script setup lang="ts">
import { genCls } from "@oragspatl/dragger-vue";
import DesignerToolbar from "./toolbar/DesignerToolbar.vue";
</script>

<style lang="scss">
@use "../../styles/variables" as *;

.#{$prefix} {
    &-designer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        height: 48px;
        color: var(--os-header-color);
        background-color: var(--os-header-bg-color);
    }

    &-designer-header-left {
        display: flex;
        gap: 10px;
        align-items: center;
    }

}

.logo {
    width: 28px;
    height: 28px;
    background-color: var(--os-primary-color);
    border-radius: 50%;
}
</style>