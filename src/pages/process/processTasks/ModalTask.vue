<template>
  <el-drawer
    v-model="modal"
    title="任务列表"
    size="90%"
    append-to-body
    destroy-on-close
    class="my-drawer"
    @close="onCloseFn"
  >
    <div
      v-loading="pending"
      class="process-info scroll_thin overflow-auto full-y"
    >
      <BasePage
        ref="BasePageRef"
        :searchFormItems="searchFormItems"
        v-model:searchFormValue="searchFormValue"
        :columns="taskCols"
        :list="ApiListTodo"
        :defaultParams="defaultParams"
        :options-size="160"
      >
        <template #options="{ row }">
          <el-button
            v-allow="'e9f451e2df1f4e4eb5ecb98c9270ddd7'"
            type="primary"
            link
            @click="() => editFn(row)"
          >
            {{ !row.completeTime ? '处理' : '修改' }}
          </el-button>
          <el-button
            v-allow="'73287da91906463eaede196ed90e9b78'"
            type="danger"
            link
            @click="() => backFn(row)"
          >
            退回
          </el-button>
          <el-button
            v-if="row.completeTime"
            v-allow="'44d370f6cb0e442da8147d113529e1ee'"
            type="primary"
            link
            @click="() => detailFn(row)"
          >
            详情
          </el-button>
        </template>
      </BasePage>
      <ModalEdit
        v-model="showModel"
        :type="modalType"
        :row="showModelRow"
        @handleSuccess="handleSuccess"
      ></ModalEdit>
    </div>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="onCloseFn">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import { getAuthUser } from '@/utils/auth';
import { useReasonConfirm } from '@/utils/hooks.js';
import BasePage from '@/components/BasePage/index';
import { ApiListTodo, ApiGoBack } from '@/http/process/processManagement.js';
import ModalEdit from './ModalEdit.vue';
import { taskCols, searchFormItems } from './data';

defineOptions({ name: 'ModalTask' });

const emit = defineEmits(['update:modelValue', 'handleRefresh']);

const props = defineProps({
  modelValue: Boolean,
  row: {
    type: Object,
  },
});

const user = getAuthUser();

const modal = ref(false);
const pending = ref(false);
const BasePageRef = ref(null);
const searchFormValue = computed(() => ({
  userId: user.userId,
  taskStatus: props.row?.taskStatus,
}));

const defaultParams = computed(() => ({
  projectId: props.row?.projectId,
}));

const modalType = ref('');
const showModel = ref(false);
const showModelRow = ref();

const addFn = () => {
  modalType.value = 'add';
  showModel.value = true;
};

const editFn = (row) => {
  modalType.value = 'edit';
  showModelRow.value = row;
  showModel.value = true;
};

/** 退回 */
const backFn = async (row) => {
  try {
    const reasonObj = await useReasonConfirm('退回'); // 二次确认

    // 调用退回接口
    await ApiGoBack({
      actDefId: row.actDefId,
      backReason: reasonObj.value,
    });

    ElMessage.success('退回成功');
    handleSuccess();
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  }
};

const detailFn = (row) => {
  modalType.value = 'detail';
  showModelRow.value = row;
  showModel.value = true;
};

// 关闭弹框
const onCloseFn = () => {
  emit('update:modelValue', false);
};

// 操作成功后刷新
const handleSuccess = () => {
  handleRefresh();
  emit('handleRefresh');
  onCloseFn();
};

// 刷新
const handleRefresh = () => {
  BasePageRef.value?.refresh();
};

// 监听弹框打开关闭
watch(
  () => props.modelValue,
  async () => {
    modal.value = props.modelValue;
  }
);
</script>

<style lang="scss" scoped></style>
