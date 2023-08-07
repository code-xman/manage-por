<template>
  <el-config-provider :z-index="elAttr.zIndex" :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// element
const elAttr = {
  zIndex: 3000,
};
</script>

<style scoped>
</style>
