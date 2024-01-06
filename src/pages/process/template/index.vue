<template>
  <div class="process full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="ApiListProjectPage"
      :options-size="140"
    >
      <template #options="{ row }">
        <el-button
          v-allow="'fc212282baff44cb88f9c64f6cc497cd'"
          type="primary"
          link
          @click="() => editFn(row)"
        >
          编辑
        </el-button>
        <el-button
          v-allow="'d8a4a6ecca9e4dcb8f6c22766be4269f'"
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
      :source="'template'"
      :row="showModelRow"
    ></ModalEdit>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
// import { getAuthUser } from '@/utils/auth';

import BasePage from '@/components/BasePage/index';
import { ApiListProjectPage } from '@/http/process/processManagement.js';
import ModalEdit from '@/pages/process/processManagement/ModalEdit';
import { columns, searchFormItems } from './data.js';

defineOptions({
  name: 'ShowBasePage',
});

// const user = getAuthUser();
const BasePageRef = ref(null);
const searchFormValue = ref({});
// 操作记录
const showOperation = ref(false);

const btns = ref([
  {
    key: 'add',
    name: '新增',
    allow: '9a6ceb39d0ff459e966c725f2cf86308',
    attrs: {
      type: 'primary',
    },
    clickFn: () => addFn(),
  },
]);

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
