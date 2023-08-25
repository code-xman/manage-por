<template>
  <div class="base-btn">
    <el-button
      v-for="btn in btns"
      :key="btn.key"
      v-allow="btn.allow"
      v-bind="btn.attrs"
      @click="btn.clickFn"
    >
      {{ btn.name }}
    </el-button>
  </div>
</template>

<script setup>
defineOptions({name: 'BaseBtn'})

const props = defineProps({
  btns: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.base-btn {
  margin-bottom: 8px;
}
</style>
