<template>
  <div class="process full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="ApiListProjectPage"
      :options-size="300"
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
          v-allow="'9c3f6a07321747489f58afdcab2c262f'"
          type="primary"
          link
          @click="() => editRecordFn(row)"
        >
          编辑记录
        </el-button>
        <!-- <el-button
          v-allow="'2d98942cbd074bdcab56459f2ff51148'"
          type="primary"
          link
          @click="() => copyFn(row)"
        >
          复制
        </el-button> -->
        <el-button
          v-allow="'adc587e366ca483198d83aa19a134906'"
          type="primary"
          link
          @click="() => detailFn(row)"
        >
          详情
        </el-button>
        <el-button
          v-allow="'2d98942cbd074bdcab56459f2ff51148'"
          type="success"
          link
          @click="() => priviewFn(row)"
        >
          预览
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
    <ModalDetail v-model="showDetail" :row="showModelRow"></ModalDetail>
    <ModalOperation
      v-model="showOperation"
      :row="showModelRow"
    ></ModalOperation>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getAuthUser } from '@/utils/auth';

import BasePage from '@/components/BasePage/index';
import { exportExcel } from '@/utils/fn.js';
import { ApiListProjectPage } from '@/http/process/processManagement.js';
import ModalEdit from '@/pages/process/processManagement/ModalEdit.vue';
import ModalDetail from '@/pages/process/processManagement/ModalDetail.vue';
import ModalOperation from '@/pages/process/processManagement/ModalOperation';
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
    key: 'useTemplate',
    name: '使用模板新增',
    allow: '962b112368364f5e8f0f22132c81a0ca',
    attrs: {
      type: 'primary',
    },
    clickFn: () => useTemplate(),
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
const showDetail = ref(false);

const addFn = () => {
  modalType.value = 'add';
  showModel.value = true;
};

const useTemplate = () => {
  
};

const editFn = (row) => {
  modalType.value = 'edit';
  showModelRow.value = row;
  showModel.value = true;
};

const editRecordFn = (row) => {
  modalType.value = 'editRecord';
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

const priviewFn = (row) => {
  showModelRow.value = row;
  showDetail.value = true;
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
