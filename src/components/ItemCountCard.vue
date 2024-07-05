<template>
  <div class="item-count-card" :style="wrapStyle">
    <el-row :gutter="10">
      <el-col v-for="(row, index) in data" :span="span" :key="index">
        <div
          :class="[
            'item',
            index >= colLength ? 'mt-10' : '',
            !!row.route ? 'item-handle' : '',
          ]"
          @click="handleItemClick(row)"
        >
          <i :class="['icon', 'iconfont', row.icon, 'icons-prefix']" />
          <span>{{ row.name }}</span>
          <em>{{ row.value }}</em>
          <i v-if="!!row.route" class="icon icon-next-ui icons-arrow" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['on-click']);

const props = defineProps({
  // 数据
  data: {
    type: Array,
    default() {
      return [];
    },
  },

  // 每哥条目占据的宽度
  span: {
    type: Number,
    default: 12,
  },

  // 可视条数
  count: {
    type: Number,
    default: 4,
  },
});

const router = useRouter();

const colLength = computed(() => {
  const { span } = props;
  return Math.ceil(24 / span);
});

// 样式计算
const wrapStyle = computed(() => {
  if (!props.count) return {};
  const _size = (props.count / 2) * 60 + (props.count - 1) * 10;
  return {
    height: `${_size}px`,
  };
});

// 条目点击事件
const handleItemClick = (row) => {
  if (!!row.route) {
    // 路由跳转
    router.push({ name: row.route, query: { pageType: row.type } });
  } else {
    // 事件触发
    emit('on-click', row);
  }
};
</script>

<style lang="scss" scoped>
.item-count-card {
  overflow: hidden;
  position: relative;
}

.item {
  // background-color: fade-out(#f1f3f7, 0.5);
  background-color: #fff;
  box-shadow: inset 0 1px 3px darken(#f1f3f7, 5%);
  border-radius: 3px;
  align-items: center;
  display: flex;
  height: 60px;
  padding: 5px 24px 5px 10px;
  position: relative;
  transition: all 0.4s ease;

  // 可点击条目
  &-handle {
    cursor: pointer;

    &:hover {
      background-color: #fff;
    }
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  // 前置图标
  .icons-prefix {
    color: #33a981;
    align-items: center;
    display: flex;
    flex-shrink: 0;
    font-size: 20px;
    justify-content: center;
    margin-left: 5px;
    margin-right: 5px;
    height: 24px;
    width: 24px;
  }

  // 后置图标
  .icons-arrow {
    color: darken(#f1f3f7, 20%);
    align-items: center;
    display: flex;
    flex-shrink: 0;
    font-size: 14px;
    justify-content: center;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    height: 24px;
    width: 24px;
  }

  span {
    display: block;
    flex: 1;
    font-size: 16px;
    font-weight: bold;
    overflow: hidden;
    padding: 0 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  em {
    color: var(--app-primary-color);
    font-family: 'DIN Alternate Bold';
    font-size: 18px;
    font-style: normal;
    line-height: 20px;
    padding: 10px 20px;
  }
}
</style>
