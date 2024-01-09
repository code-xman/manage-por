<template>
  <el-drawer
    v-model="modal"
    title="详情"
    size="1200px"
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
        <el-button type="primary" @click="onPrintFn">打印</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { getAuthUser } from '@/utils/auth';

defineOptions({ name: 'ProcessModalDetail' });

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Boolean,
  row: {
    type: Object,
  },
});

const user = getAuthUser();
const modal = ref(false);
const modalDetailContentRef = ref(null);

const reportUrl = computed(() => {
  return `/#/processDetailContent?projectId=${props.row.projectId}`;
});

// 监听弹框打开关闭
watch(
  () => props.modelValue,
  async () => {
    modal.value = props.modelValue;
  }
);

// 打印
const onPrintFn = () => {
  modalDetailContentRef.value?.contentWindow.print();
};

const onCloseFn = () => {
  emit('update:modelValue', false);
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: center;
}
iframe {
  width: 1075px;
  height: 100%;
}
</style>
