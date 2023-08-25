<template>
  <el-config-provider :z-index="elAttr.zIndex" :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import Color from 'color';
import { getAuthUser } from '@/utils/auth';

const route = useRoute();
const user = getAuthUser();

// element
const elAttr = {
  zIndex: 3000,
};

// 商户主题更新
const changeTheme = () => {
  if (!user) return;

  // 已更新主题
  if (document.querySelector('.userBrand')) return;

  // 初始化主题
  const style = document.createElement('style');
  style.className = 'userBrand';

  // 主题色
  const colorPrimary = user.bgColor || '#409EFF';

  style.textContent = `
    :root {
      --el-color-primary: ${colorPrimary};
      --el-color-primary-dark-2: ${Color(colorPrimary).darken(0.2).hex()};
      --el-color-primary-light-3: ${Color(colorPrimary).darken(0.2).lighten(0.3).hex()};
      --el-color-primary-light-5: ${Color(colorPrimary).darken(0.2).lighten(0.5).hex()};
      --el-color-primary-light-7: ${Color(colorPrimary).darken(0.2).lighten(0.7).hex()};
      --el-color-primary-light-8: ${Color(colorPrimary).darken(0.2).lighten(0.8).hex()};
      --el-color-primary-light-9: ${Color(colorPrimary).darken(0.2).lighten(0.9).hex()};
    }
    `;
  document.body.appendChild(style);
};

watch(route, () => {
  changeTheme();
});
</script>

<style scoped></style>
