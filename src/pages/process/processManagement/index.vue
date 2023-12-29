<template>
  <div class="process full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="ApiListProjectPage"
      :options-size="220"
    >
      <template #options="{ row }">
        <el-button
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
        <el-button
          v-allow="'585050548c86475b96fb5ec184f6aafe'"
          type="warning"
          link
          @click="() => operationRecordsFn(row)"
        >
          操作记录
        </el-button>
      </template>
    </BasePage>
    <ModalEdit
      v-model="showModel"
      :type="modalType"
      :row="showModelRow"
    ></ModalEdit>
    <ModalOperation v-model="showOperation" :row="showModelRow"></ModalOperation>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getAuthUser } from '@/utils/auth';

import BasePage from '@/components/BasePage/index';
import { exportExcel } from '@/utils/fn.js';
import { ApiListProjectPage } from '@/http/process/processManagement.js';
import ModalEdit from './ModalEdit.vue';
import ModalOperation from './ModalOperation.vue';
import { columns, searchFormItems } from './data';

defineOptions({
  name: 'ShowBasePage',
});

const user = getAuthUser();
const BasePageRef = ref(null);
const searchFormValue = ref({});
// 操作记录
const showOperation = ref(false);

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
  {
    key: 'download',
    name: '导出台账',
    attrs: {
      type: 'success',
    },
    clickFn: () => downloadFn(),
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

const operationRecordsFn = (row) => {
  showModelRow.value = row;
  showOperation.value = true;
};

const downloadFn = async () => {
  try {
    const data = await ApiListProjectPage({
      pageSize: 1e5,
    });
    if (data.total > 1e5) {
      ElMessage.warning('最多支持导出10万条数据！');
    }
    exportExcel(data.list, `项目${Date.now()}.xlsx`, columns);
  } catch (error) {
    ElMessage.error(`${error}`);
  }
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
