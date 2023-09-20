<template>
  <span :class="['cell', `cell__${type}`,]">
    <em><slot /></em>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// 自定义 Tag
export default defineComponent({
  name: 'BTag',
  props: {
    // 类型
    type: {
      type: String,
      default: 'default',
    },
  },
});
</script>

<style lang="scss" scoped>
.cell {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
  line-height: 32px;
  padding-left: 20px;
  padding-right: 5px;
  overflow: hidden;
  vertical-align: middle;
  background-color: var(--el-fill-color-lighter);
  text-align: left;
  color: #FFF;

  & > em {
    display: inline-block;
    font-style: normal;
    overflow: hidden;
    max-width: 128px;
    text-overflow: ellipsis;
    vertical-align: top;
    white-space: nowrap;
  }

  &__primary {
    background-color: var(--el-color-primary);
  }

  &__success {
    background-color: var(--el-color-success);
  }

  &__danger {
    background-color: #ff4040;
  }

  &__warning {
    background-color: #ff8c40;
  }

  &__info {
    background-color: var(--el-border-color-light);
  }

  &__yellow {
    background-color: #ffc400;
  }

  &__purple {
    background-color: #c23ce6;
  }
}
</style>
