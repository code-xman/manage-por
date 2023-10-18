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
          v-allow="'e5683cbac0e649d19b514967d1589bad'"
          type="primary"
          link
          @click="() => editFn(row)"
        >
          编辑
        </el-button>
        <el-button
          v-allow="'2d98942cbd074bdcab56459f2ff51148'"
          type="primary"
          link
          @click="() => copyFn(row)"
        >
          复制
        </el-button>
        <el-button
          v-allow="'adc587e366ca483198d83aa19a134906'"
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
    allow: 'f7954f60ffb747759e43438bb3b77b73',
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
