<template>
    <div v-if="position && direction" ref="dragBar" class="drag-bar" :class="{
        horizontal: direction === 'horizontal',
        vertical: direction === 'vertical'
    }"
    :style="dragBarStyle"
    @mousedown="onMouseDown"
    ></div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
    direction: 'horizontal' | 'vertical';
    position: 'start' | 'end';
    range: [number, number];
}>(), {
    range: [0, Infinity]
});

const dragBar = ref<HTMLElement | null>(null);

const startDrag = ref(false);

const dragBarStyle = computed(() => {
    if (props.direction === 'horizontal') {
        return {
            top: props.position === 'start' ? 0 : undefined,
            bottom: props.position === 'end' ? 0 : undefined,
        };
    } else if (props.direction === 'vertical') {
        return {
            left: props.position === 'start' ? 0 : undefined,
            right: props.position === 'end' ? 0 : undefined,
        };
    }
});

const startPostion = reactive({ x: 0, y: 0, width: 0, height: 0 });
const onMouseDown = (event: MouseEvent) => {
    if (dragBar.value) {
        startDrag.value = true;
        dragBar.value.style.zIndex = '2';
        startPostion.x = event.clientX;
        startPostion.y = event.clientY;
        const parent = dragBar.value.parentElement;
        if (parent) {
            startPostion.width = parent.offsetWidth;
            startPostion.height = parent.offsetHeight;
        }
    }
};

const onMouseMove = (event: MouseEvent) => {
    if (dragBar.value && startDrag.value) {
        const parent = dragBar.value.parentElement;
        let dx = 0
        let dy = 0
        if (parent) {
            const rect = parent.getBoundingClientRect();
            dx = event.clientX - startPostion.x;
            dy = event.clientY - startPostion.y;
        }

        const calculations = {
            horizontal: {
                start: (dy) => startPostion.height - dy,
                end: (dy) => startPostion.height + dy
            },
            vertical: {
                start: (dx) => startPostion.width - dx,
                end: (dx) => startPostion.width + dx
            }
        };

        const dimension = props.direction === 'horizontal' ? 'height' : 'width';
        const change = props.direction === 'horizontal' ? dy : dx;

        const parentWidth = calculations[props.direction][props.position](change);
        parent.style[dimension] = Math.min(Math.max(parentWidth, props.range[0]), props.range[1]) + 'px';
    }
};

const onMouseUp = (event: MouseEvent) => {
    if (dragBar.value) {
        startDrag.value = false;
        dragBar.value.style.zIndex = '1';
    }
};

onMounted(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
});
</script>

<style scoped>
.drag-bar {
    position: absolute;
    background-color: #f0f0f0;
    z-index: 1;
}

.drag-bar:hover {
    z-index: 2;
    background-color: #e0e0e0;
}

.horizontal {
    left: 0;
    right: 0;
    height: 2px;
    cursor: ns-resize;
}

.vertical {
    width: 2px;
    top: 0;
    bottom: 0;
    cursor: ew-resize;
}
</style>