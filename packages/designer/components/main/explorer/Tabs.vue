<template>
    <div :class="genCls('tabs')">
        <div :class="[genCls('tab-item'), activeTabName === item ? 'active' : '']" @click="activeTabName = item"
            v-for="item in options" :key="item">
            {{ item }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { genCls } from "@oragspatl/dragger-vue";
import { computed } from "vue";

const props = defineProps<{
    options: string[],
    modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])
const activeTabName = computed({
    get: () => props.modelValue,
    set: (val) => {
        emit('update:modelValue', val)
    }
})
</script>

<style lang="scss">
@use "../../../styles/variables" as *;

.#{$prefix} {
    &-tabs {
        width: 100%;
        border-bottom: 1px solid var(--os-operation-border-color);
        display: flex;
        font-size: 12px;
        padding: 0 10px;
    }

    &-tab-item {
        padding: 10px;
        cursor: pointer;
        color: var(--os-operation-color);
        border-bottom: 2px solid transparent;

        &:hover {
            font-weight: 500;
            color: var(--os-primary-font-dark-color);
        }

        &.active {
            font-weight: 500;
            color: var(--os-primary-font-dark-color);
        }
    }
}
</style>