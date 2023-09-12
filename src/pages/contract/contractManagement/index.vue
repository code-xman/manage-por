<template>
  <div class="merchant full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="ApiListContractPage"
      :options-size="120"
    >
      <template #options="{ row }">
        <el-button
          v-if="!['OVERDUE'].includes(row.urgency)"
          v-allow="'9d37b0aa0b9843368dcc7743acda709c'"
          type="primary"
          link
          @click="() => editFn(row)"
        >
          编辑
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
import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';

import BasePage from '@/components/BasePage/index';
import { ApiListContractPage } from '@/http/contract/contractManagement';
import ModalEdit from './ModalEdit.vue';
import { columns, searchFormItems } from './data';

defineOptions({
  name: 'ShowBasePage',
});

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
  {
    key: 'download',
    name: '下载',
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

const detailFn = (row) => {
  modalType.value = 'detail';
  showModelRow.value = row;
  showModel.value = true;
};

// 导出Excel
const exportExcel = (data) => {
  // 创建工作簿
  const _workbook = new ExcelJS.Workbook();
  // 添加工作表
  const worksheet = _workbook.addWorksheet('sheet1');

  const _columns = columns.filter((col) => col.prop);
  // 设置表格内容
  worksheet.columns = _columns.map((col) => {
    return {
      header: col.label,
      key: col.prop,
      width: Number((col.width || col.minWidth)?.replace('px', '') || 200) / 10,
    };
  });

  worksheet.addRows(data);

  // 导出表格
  _workbook.xlsx.writeBuffer().then((buffer) => {
    let _file = new Blob([buffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(_file, `合同${Date.now()}.xlsx`);
  });
};

const downloadFn = async () => {
  try {
    const data = await ApiListContractPage({
      pageSize: 1e5,
    });
    if (data.total > 1e5) {
      ElMessage.warning('最多支持导出10万条数据！')
    }
    exportExcel(data.list);
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
