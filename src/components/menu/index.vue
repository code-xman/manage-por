<template>
  <el-menu class="menu scroll_thin" :unique-opened="true">
    <MenuSub v-for="(item, index) in menuList" :key="item.index" v-bind="item">
    </MenuSub>
  </el-menu>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MenuSub from './MenuSub.vue';

// 路由
const router = useRouter();

const menuList = ref([]);

const handleMenuData = (data) => {
  if (!data) return [];
  const res = data
    .filter((item) => !item.meta?.menuHide)
    .map((item) => {
      return {
        title: item.meta?.title || '',
        index: item.name || '',
        name: item.name || '',
        path: item.path,
        child: handleMenuData(item.children || []),
        meta: item.meta,
      };
    });

  return res;
};

onMounted(() => {
  menuList.value = handleMenuData([...router.options.routes]);
  // console.log('object :>> ', menuList.value);
});
</script>

<style lang="scss" scoped>
.el-menu.el-menu--vertical.menu {
  min-width: 200px;
  width: 200px;
  padding: 4px;
  overflow-y: auto;
  overflow-x: hidden;

  .el-menu-item {
    height: 40px;
    line-height: 40px;
    padding: 0;
  }
  :deep(.el-sub-menu) {
    .el-sub-menu__title,
    .el-menu-item {
      margin-bottom: 4px;
      max-width: 100%;
      min-width: 100%;
      height: 40px;
      line-height: 40px;
      padding: 0;
      font-size: 14px;
      font-weight: 600;
    }
    .el-menu.el-menu--inline {
      .el-sub-menu,
      .el-menu-item {
        padding-left: 32px;
      }
    }

    &.is-active {
      .el-sub-menu__title {
        border-radius: 5px;
        background: var(--el-color-primary);
        color: #fff;
      }
    }
  }
}
</style>
