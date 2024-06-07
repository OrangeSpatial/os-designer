<template>
    <div :class="genCls('designer-root')">
        <DesignerHeader />
        <DesignerMain :assets="assetList" />
    </div>
</template>

<script setup lang="ts">
import { genCls } from "@oragspatl/dragger-vue";
import DesignerHeader from "./header/DesignerHeader.vue";
import DesignerMain from "./main/DesignerMain.vue";
import "../styles/index"
import assets from '../data/assets.json'
import { provide, ref } from "vue";
import { AssetsKeyByIdSymbol } from "../common/injectSymbol";

const assetsKeyById = assets.reduce((acc, asset) => {
    acc[asset.id] = asset;
    return acc;
}, {});

provide(AssetsKeyByIdSymbol, assetsKeyById);

const assetList = ref(assets);

</script>

<style lang="scss">
@use "../styles/variables" as *;

.#{$prefix} {
    &-designer-root {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
}
</style>