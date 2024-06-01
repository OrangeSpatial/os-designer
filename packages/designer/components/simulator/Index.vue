<template>
    <div class="simulator" :style="{
        width: simulatorWidth,
    }">
        <div class="simulator-header-bar">
            <el-button @click="changeSize" type="warning" :icon="Switch" size="small" circle alt="切换尺寸" />
            <el-button @click="maxMinChange" v-if="!maxSize" alt="最小化/最大化" type="success" :icon="Plus" size="small"
                circle />
            <el-button @click="maxMinChange" v-else alt="最小化/最大化" type="success" :icon="Minus" size="small" circle />
        </div>
        <div class="simulator-container">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ElButton } from "element-plus";
import { Switch, Plus, Minus } from "@element-plus/icons-vue";

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
        padding: 4px 4px;
    }

    .simulator-container {
        flex: 1;
        padding: 4px;
        background-color: #ffffff;
    }
}
</style>