<template>
  <div class="process full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="projectSearchFormItems"
      v-model:searchFormValue="searchFormValue"
      :columns="projectCols"
      :list="ApiListTodo"
      :options-size="120"
    >
      <template #options="{ row }">
        <el-button type="primary" link @click="() => detailFn(row)">
          查看任务
        </el-button>
      </template>
    </BasePage>
    <ModalTask v-model="showModel" :row="showModelRow"></ModalTask>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

import { getAuthUser } from '@/utils/auth';
import BasePage from '@/components/BasePage/index';
// TODO: 更换查询任务项目的接口
import { ApiListTodo } from '@/http/process/processManagement.js';
import ModalTask from './ModalTask.vue';
import { projectCols, projectSearchFormItems } from './data';

defineOptions({
  name: 'ProcessTasks',
});

const user = getAuthUser();

const BasePageRef = ref(null);
const searchFormValue = ref({
  userId: user.userId,
  taskStatus: 'WAIT',
});

const modalType = ref('');
const showModel = ref(false);
const showModelRow = ref();

const detailFn = (row) => {
  modalType.value = 'detail';
  showModelRow.value = row;
  showModel.value = true;
};

watch(
  () => showModel.value,
  () => {
    if (!showModel.value) {
      BasePageRef.value?.refresh();
    }
  }
);
</script>

<style lang="scss" scoped></style>
