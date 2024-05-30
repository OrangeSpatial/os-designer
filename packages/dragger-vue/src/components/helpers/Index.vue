<template>
    <div class="dtd-aux-helpers top-right">
        top-right
    </div>
    <div class="dtd-aux-helpers top-left">
        top-left
    </div>
    <div class="dtd-aux-helpers bottom-right">
        bottom-right
    </div>
    <div class="dtd-aux-helpers bottom-left">
        bottom-left
    </div>
</template>

<script lang="ts" setup>
import { DtdNode } from '@oragspatl/dragger';

defineProps<{
    node: DtdNode;
}>();
</script>

<style scoped>
    .dtd-aux-helpers {
        pointer-events: auto;
        position: absolute;
        height: 20px;
        color: white;
        background-color: #019e91;
        margin: 4px 0;
    }
    .top-right {
        top: -28px;
        right: 0;
    }
    .top-left {
        top: -28px;
        left: 0;
    }
    .bottom-right {
        bottom: -28px;
        right: 0;
    }
    .bottom-left {
        bottom: -28px;
        left: 0;
    }
</style>