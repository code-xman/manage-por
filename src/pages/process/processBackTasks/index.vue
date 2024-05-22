<template>
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
          type="warning"
          link
          @click="() => editFn(row)"
        >
          处理
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
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import { getAuthUser } from '@/utils/auth';
import BasePage from '@/components/BasePage/index';
import { ApiListTodo } from '@/http/process/processManagement.js';
import { ApiListUser } from '@/http/setting/user.js';
import { taskCols, searchFormItems } from './data';

defineOptions({ name: 'ModalBackTask' });

const user = getAuthUser();

const BasePageRef = ref(null);
const searchFormValue = ref({
  userId: user.userId,
  // taskStatus: 'WAIT',
});

const pending = ref(false);
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

    // TODO: 更换步骤负责人
    // await

    showModel.value = false;
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

watch(
  () => showModel.value,
  () => {
    assignee.value = '';
    if (!showModel.value) {
      BasePageRef.value?.refresh();
    }
  }
);
</script>

<style lang="scss" scoped></style>
