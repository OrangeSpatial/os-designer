<template>
    <div :class="genCls('designer-worksapce')">
        <div :class="genCls('designer-worksapce-header')">
            <div class="header-left"></div>
            <div class="header-center">
            </div>
            <div class="header-right"></div>
        </div>

        <div :class="genCls('designer-worksapce-content')">
            <Simulator>
                <slot></slot>
            </Simulator>
        </div>
        <div :class="genCls('designer-worksapce-footer')"></div>
    </div>
</template>

<script setup lang="ts">
import { genCls } from "@oragspatl/dragger-vue";
import Simulator from "../../simulator/Index.vue";

</script>

<style lang="scss" scoped>
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
        background-color: #f4f4f4;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header-left {}

        .header-center {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .header-right {}
    }

    &-designer-worksapce-content {
        flex: 1;
        overflow: auto;
        padding: 10px;
        display: flex;
        justify-content: center;
    }

    &-designer-worksapce-footer {
        background-color: var(--os-footer-bg-color);
    }
}
</style>