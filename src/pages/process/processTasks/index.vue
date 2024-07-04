<template>
  <div class="process full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="projectSearchFormItems"
      v-model:searchFormValue="searchFormValue"
      :columns="projectCols"
      :list="ApiListGroup"
      :options-size="120"
    >
      <template #options="{ row }">
        <el-button
          v-if="row.taskStatus"
          type="primary"
          link
          @click="() => detailFn(row)"
        >
          查看任务
        </el-button>
      </template>
    </BasePage>
    
    <ModalTask
      v-model="showModel"
      :row="showModelRow"
      @handleRefresh="handleRefresh"
    ></ModalTask>

    <ModalBackTask
      v-model="showBackModel"
      :row="showModelRow"
      @handleRefresh="handleRefresh"
    ></ModalBackTask>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

import { getAuthUser } from '@/utils/auth';
import BasePage from '@/components/BasePage/index';
import { ApiListGroup } from '@/http/process/processManagement.js';
import ModalTask from './ModalTask.vue';
import ModalBackTask from './processBackTasks/index.vue';
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
const showBackModel = ref(false);
const showModelRow = ref();

const detailFn = (row) => {
  modalType.value = 'detail';
  showModelRow.value = row;
  if (['WAIT', 'DONE'].includes(row.taskStatus)) {
    showModel.value = true;
  }
  if (row.taskStatus === 'BACK') {
    showBackModel.value = true;
  }
};

const handleRefresh = () => {
  BasePageRef.value?.refresh();
};
</script>

<style lang="scss" scoped></style>
