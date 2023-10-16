<template>
  <el-sub-menu v-if="hasChild" :index="props.index">
    <template #title>
      <i v-if="props.meta?.icon" class="icon iconfont" :class="props.meta.icon" />
      <div class="menu-item" :class="{noIcon: !props.meta.icon}">{{ props.title }}</div>
    </template>
    <MenuSub
      v-for="(item, index) in props.child"
      :key="item.index"
      v-bind="$attrs"
      :index="item.index"
      :title="item.title"
      :path="item.path"
      :name="item.name"
      :child="item.child"
    ></MenuSub>
  </el-sub-menu>
  <el-menu-item v-else :index="props.index">
    <template #title>
      <i v-if="props.meta?.icon" class="icon iconfont" :class="props.meta.icon" />
      <el-tooltip
        effect="dark"
        placement="top"
        class="box-item"
        :show-after="1000"
        :content="props.title"
      >
        <div
          class="menu-item"
          @click="
            () =>
              toPage({
                label: props.title,
                value: props.name,
              })
          "
        >
          {{ props.title }}
        </div>
      </el-tooltip>
    </template>
  </el-menu-item>
</template>

<script setup>
import { useAttrs, computed } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'MenuSub',
});

const props = defineProps({
  index: String,
  title: String,
  path: String,
  name: String,
  child: Array,
  meta: Object,
});
// self --> this
// const self = getCurrentInstance();

const attrs = useAttrs();
const hasChild = computed(() => {
  // 无子菜单
  if (!props.child || props.child.length === 0) return false;
  // 不隐藏的子菜单
  const propsChild = props.child.filter(pc => pc.meta.menuHide !== true);
  return propsChild?.length > 0;
});

// 路由
const router = useRouter();
const toPage = (rote) => {
  // console.log('rote :>> ', rote,);
  router.push({ name: rote.value });
  attrs.onRouteChange?.(rote);
};
</script>

<style lang="scss" scoped>
.icon {
  padding-left: 8px;
  font-weight: 600;
}
.menu-item {
  width: 100%;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  font-weight: 600;
  &.noIcon {
    margin-left: 24px;
  }
}
</style>
