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
    background-color: darken($colorBorder, 5%);
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
    background-color: fade-out($colorPrimary, 0.5);
  }

  &__success::before {
    background-color: fade-out($colorSitSuccess, 0.5);
  }

  &__danger::before {
    background-color: fade-out($colorSitDanger, 0.5);
  }

  &__warning::before {
    background-color: fade-out($colorSitWarning, 0.5);
  }

  &__info::before {
    background-color: fade-out($colorSitInfo, 0.5);
  }

  &.is__border {
    color: $colorTextLight;
    background-color: $colorBorder;
    border: 1px darken($colorBorder, 5%) solid;
    border-radius: 32px;
    padding: 3px 12px;

    &::before {
      content: unset;
      display: none;
    }
  }

  &__primary.is__border {
    color: $colorPrimary;
    border-color: fade-out($colorPrimary, 0.7);
    background-color: fade-out($colorPrimary, 0.9);
  }

  &__success.is__border {
    color: $colorSitSuccess;
    border-color: fade-out($colorSitSuccess, 0.7);
    background-color: fade-out($colorSitSuccess, 0.9);
  }

  &__danger.is__border {
    color: $colorSitDanger;
    border-color: fade-out($colorSitDanger, 0.7);
    background-color: fade-out($colorSitDanger, 0.9);
  }

  &__warning.is__border {
    color: $colorSitWarning;
    border-color: fade-out($colorSitWarning, 0.7);
    background-color: fade-out($colorSitWarning, 0.9);
  }

  &__info.is__border {
    color: $colorSitInfo;
    border-color: fade-out($colorSitWarning, 0.7);
    background-color: fade-out($colorSitWarning, 0.9);
  }
}
</style>
