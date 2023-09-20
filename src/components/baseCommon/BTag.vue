<template>
  <span :class="['tag', `tag__${type}`, border ? 'is__border' : '']">
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

    // 显示为边框模式，边框模式会隐藏圆点
    border: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.tag {
  display: inline-block;
  overflow: hidden;
  text-align: left;
  padding-left: 20px;
  padding-right: 5px;
  position: relative;
  vertical-align: middle;

  & > em {
    display: inline-block;
    font-style: normal;
    overflow: hidden;
    max-width: 128px;
    text-overflow: ellipsis;
    vertical-align: top;
    white-space: nowrap;
  }

  &::before {
    background-color: var(--el-fill-color-lighter);
    border-radius: 50%;
    content: '';
    height: 8px;
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
  }

  &__primary::before {
    background-color: var(--el-color-primary);
  }

  &__success::before {
    background-color: var(--el-color-success);
  }

  &__danger::before {
    background-color: var(--el-color-error);
  }

  &__warning::before {
    background-color: var(--el-color-warning);
  }

  &__info::before {
    background-color: var(--el-border-color-light);
  }

  &__yellow::before {
    background-color: #ee1;
  }

  &__purple::before {
    background-color: #6d63ff;
  }

  &.is__border {
    color: var(--el-color-text);
    background-color: var(--el-fill-color-lighter);
    border: 1px var(--el-fill-color-light) solid;
    border-radius: 32px;
    padding: 2px 12px;

    &::before {
      content: unset;
      display: none;
    }
  }

  &__primary.is__border {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary-light-7);
    background-color: var(--el-color-primary-light-9);
  }

  &__success.is__border {
    color: var(--el-color-success);
    border-color: var(--el-color-success-light-7);
    background-color: var(--el-color-success-light-9);
  }

  &__danger.is__border {
    color: var(--el-color-error);
    border-color: var(--el-color-error-light-7);
    background-color: var(--el-color-error-light-9);
  }

  &__warning.is__border {
    color: var(--el-color-warning);
    border-color: var(--el-color-warning-light-7);
    background-color: var(--el-color-warning-light-9);
  }

  &__info.is__border {
    color: var(--el-color-info);
    border-color: var(--el-border-color-light);
    background-color: var(--el-border-color-extra-light);
  }

  &__yellow.is__border {
    color: #ee1;
    border-color: #ee1;
    background-color: #ee1;
  }

  &__purple.is__border {
    color: #6d63ff;
    border-color: #6d63ff;
    background-color: #6d63ff;
  }
}
</style>
