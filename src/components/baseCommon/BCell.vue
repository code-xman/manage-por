<template>
  <span :class="['cell', `cell__${type}`,]">
    <em><slot /></em>
  </span>
</template>

<script>
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
  position: relative;
  margin: 5px 10px;
  width: calc(100% - 20px);
  height: calc(100% - 10px);
  line-height: 32px;
  padding-left: 10px;
  padding-right: 10px;
  overflow: hidden;
  vertical-align: middle;
  background-color: var(--el-fill-color-lighter);
  text-align: left;
  color: #FFF;

  display: flex;
  align-items: center;

  & > em {
    display: inline-block;
    font-style: normal;
    overflow: hidden;
    max-width: 100%;
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
    background-color: #ff4040DD;
  }

  &__warning {
    background-color: #ff8c40DD;
  }

  &__info {
    background-color: #409EFFDD;
  }

  &__yellow {
    background-color: #ffc400DD;
  }

  &__purple {
    background-color: #c23ce6DD;
  }
}
</style>
