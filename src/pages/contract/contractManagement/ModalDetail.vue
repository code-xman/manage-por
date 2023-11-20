<template>
  <el-drawer
    v-model="modal"
    title="详情"
    size="90%"
    append-to-body
    destroy-on-close
    class="my-drawer"
    @close="onCloseFn"
  >
    <div class="content full-y">
      <iframe ref="modalDetailContentRef" :src="reportUrl" frameborder="0" />
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="onCloseFn">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch, computed, } from 'vue';

defineOptions({ name: 'OrganModalDetail' });

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Boolean,
  row: {
    type: Object,
  },
});

const modal = ref(false);
const modalDetailContentRef = ref(null);

const reportUrl = computed(() => {
  return `/#/contractDetailContent?contractNo=${props.row.contractNo}`
})

// 监听弹框打开关闭
watch(
  () => props.modelValue,
  async () => {
    modal.value = props.modelValue;
  }
);

const onCloseFn = () => {
  emit('update:modelValue', false);
};
</script>

<style lang="scss" scoped>
iframe {
  width: 100%;
  height: 100%;
}
</style>
