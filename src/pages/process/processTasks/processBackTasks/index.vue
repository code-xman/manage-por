<template>
  <el-drawer
    v-model="modal"
    title="任务退回列表"
    size="90%"
    append-to-body
    destroy-on-close
    class="my-drawer"
    @close="onCloseFn"
  >
    <div class="process full">
      <BasePage
        ref="BasePageRef"
        :searchFormItems="searchFormItems"
        v-model:searchFormValue="searchFormValue"
        :columns="taskCols"
        :list="ApiListTodo"
        :options-size="120"
      >
        <template #options="{ row }">
          <el-button
            v-allow="'33b5a17a027944198b658b1705476b52'"
            type="primary"
            link
            @click="() => editFn(row)"
          >
            处理
          </el-button>
          <el-button
            v-allow="'128bb5186bdd473ca746e47c9fac5eb1'"
            type="danger"
            link
            @click="() => rejectFn(row)"
          >
            拒绝
          </el-button>
        </template>
      </BasePage>
      <el-dialog v-model="showModel" title="处理退回任务" width="600px">
        <div class="content p-20 flex center">
          <div class="mr-20">步骤负责人</div>
          <el-select
            v-model="assignee"
            placeholder="请选择步骤负责人"
            clearable
            class="flex-1"
          >
            <el-option
              v-for="item in assignees"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showModel = false">取消</el-button>
            <el-button
              v-loading="pending"
              type="primary"
              @click="handelBackTasks"
            >
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="onCloseFn">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import { getAuthUser } from '@/utils/auth';
import { useReasonConfirm } from '@/utils/hooks.js';
import BasePage from '@/components/BasePage/index';
import {
  ApiListTodo,
  ApiGoBackPass,
  ApiGoBackReject,
} from '@/http/process/processManagement.js';
import { ApiListUser } from '@/http/setting/user.js';
import { taskCols, searchFormItems } from './data';

defineOptions({ name: 'ModalBackTask' });

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: Boolean,
  row: {
    type: Object,
  },
});

// 监听弹框打开关闭
watch(
  () => props.modelValue,
  async () => {
    modal.value = props.modelValue;
  }
);

const user = getAuthUser();

const BasePageRef = ref(null);
const searchFormValue = ref({
  userId: user.userId,
  taskStatus: 'BACK',
  projectId: props.row?.projectId,
});

const pending = ref(false);
const modal = ref(false);
const showModel = ref(false);
const showModelRow = ref();
const assignees = ref([]);
const assignee = ref('');

const editFn = async (row) => {
  try {
    showModelRow.value = row;
    assignees.value = await ApiListUser({
      orgId: user.orgId,
    });
    showModel.value = true;
  } catch (error) {
    ElMessage.error(`${error}`);
  }
};

const handelBackTasks = async () => {
  try {
    pending.value = true;
    if (!assignee.value) throw '请选择步骤负责人';

    // 更换步骤负责人
    await ApiGoBackPass({
      actDefId: showModelRow.value.actDefId,
      assignee: assignee.value,
      assigneeName: assignees.value.find(
        (item) => item.value === assignee.value
      )?.label,
    });

    ElMessage.success('操作成功');
    showModel.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

const rejectFn = async (row) => {
  try {
    pending.value = true;
    
    const reasonObj = await useReasonConfirm('拒绝'); // 二次确认

    // 拒绝
    await ApiGoBackReject({
      actDefId: row.actDefId,
      backReason: reasonObj.value,
    });
    
    ElMessage.success('操作成功');
    showModel.value = false;
    handleRefresh();
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

const onCloseFn = () => {
  emit('update:modelValue', false);
};

const handleRefresh = () => {
  BasePageRef.value?.refresh();
};

watch(
  () => showModel.value,
  () => {
    assignee.value = '';
  }
);
</script>

<style lang="scss" scoped></style>
