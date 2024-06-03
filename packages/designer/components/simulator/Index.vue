<template>
    <div class="simulator" :style="{
        width: simulatorWidth,
    }">
        <div class="simulator-header-bar">
            <a-button @click="changeSize" class="yellow" type="primary" shape="circle" :icon="h(ColumnWidthOutlined)"
                size="small" alt="切换尺寸" />
            <a-button @click="maxMinChange" class="green" v-if="!maxSize" alt="最小化/最大化" type="primary" shape="circle"
                :icon="h(ArrowsAltOutlined)" size="small" />
            <a-button @click="maxMinChange" class="green" v-else alt="最小化/最大化" type="primary" shape="circle"
                :icon="h(ShrinkOutlined)" size="small" />
        </div>
        <div class="simulator-container">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue";
import { ArrowsAltOutlined, ShrinkOutlined, ColumnWidthOutlined } from "@ant-design/icons-vue";

const sizes = [
    '375px',
    '414px',
    '768px',
    '1024px',
    '100%'
]

const maxSize = ref(true);
const sizeIndex = ref(sizes.length - 1);
let flag = false;

const simulatorWidth = computed(() => {
    return sizes[sizeIndex.value];
});

function maxMinChange() {
    maxSize.value = !maxSize.value;
    if (maxSize.value) {
        sizeIndex.value = sizes.length - 1;
    } else {
        sizeIndex.value = 0;
    }
    flag = !flag;
}

function changeSize() {
    if (!flag) {
        sizeIndex.value -= 1;
    } else {
        sizeIndex.value += 1;
    }
    if (sizeIndex.value === 0) {
        flag = !flag;
        maxSize.value = false;
    }
    if (sizeIndex.value === sizes.length - 1) {
        flag = !flag;
        maxSize.value = true;
    }
}

</script>

<style lang="scss" scoped>
.simulator {
    display: flex;
    flex-direction: column;

    .simulator-header-bar {
        background-color: #f4f4f4;
        border-radius: 10px 10px 0 0;
        display: flex;
        align-items: center;
        padding: 8px 8px;

        :deep(.ant-btn) {
            width: 14px;
            height: 14px;
            min-width: 12px;
            font-size: 8px;
            font-weight: bold;
            border: none;
        }

        .ant-btn+.ant-btn {
            margin-left: 6px;
        }

        .yellow {
            background-color: #f4bf4f;
            color: #000000;

            &:hover {
                background-color: rgb(251, 223, 65);
            }
        }

        .green {
            background-color: #61c554;
            color: #000000;

            &:hover {
                background-color: #65de55;
            }
        }
    }

    .simulator-container {
        flex: 1;
        padding: 4px;
        background-color: #ffffff;
    }
}
</style>