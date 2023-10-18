<template>
  <div class="process full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :columns="columns"
      :list="ApiListTodo"
      :options-size="120"
    >
      <template #options="{ row }">
        <el-button
          v-allow="'e9f451e2df1f4e4eb5ecb98c9270ddd7'"
          type="primary"
          link
          @click="() => editFn(row)"
        >
          {{ !row.completeTime ? '处理' : '修改'}}
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
    ></ModalEdit>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

import { getAuthUser } from '@/utils/auth';
import BasePage from '@/components/BasePage/index';
import { ApiListTodo } from '@/http/process/processManagement.js';
import ModalEdit from './ModalEdit.vue';
import { columns, searchFormItems } from './data';

defineOptions({
  name: 'ShowBasePage',
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

const addFn = () => {
  modalType.value = 'add';
  showModel.value = true;
};

const editFn = (row) => {
  modalType.value = 'edit';
  showModelRow.value = row;
  showModel.value = true;
};

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
