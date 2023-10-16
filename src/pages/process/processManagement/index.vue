<template>
  <div class="process full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="ApiListProjectPage"
      :options-size="160"
    >
      <template #options="{ row }">
        <el-button
          v-if="
            !['OVERDUE'].includes(row.urgency) &&
            row.contractAdminId === user.userId
          "
          v-allow="'9d37b0aa0b9843368dcc7743acda709c'"
          type="primary"
          link
          @click="() => editFn(row)"
        >
          编辑
        </el-button>
        <el-button
          v-allow="'b11afc3b734f42e7816525882c45f70c'"
          type="primary"
          link
          @click="() => copyFn(row)"
        >
          复制
        </el-button>
        <el-button
          v-allow="'ecffee4ca0d146c4863f71465ab5e06b'"
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
import { ApiListProjectPage } from '@/http/process/processManagement.js';
import ModalEdit from './ModalEdit.vue';
import { columns, searchFormItems } from './data';

defineOptions({
  name: 'ShowBasePage',
});

const user = getAuthUser();
const BasePageRef = ref(null);
const searchFormValue = ref({});

const btns = ref([
  {
    key: 'add',
    name: '新增',
    allow: 'b11afc3b734f42e7816525882c45f70c',
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

const copyFn = (row) => {
  modalType.value = 'copy';
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
