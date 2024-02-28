<template>
  <div class="merchant full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="ApiListContractPage"
      :options-size="400"
    >
      <template #options="{ row }">
        <el-button
          v-if="!['OVERDUE'].includes(row.urgency)"
          v-allow="'9d37b0aa0b9843368dcc7743acda709c'"
          type="primary"
          link
          @click="() => editFn(row)"
        >
          {{ row.needSupply === '1' ? '完善合同' : '编辑' }}
        </el-button>
        <el-button
          v-if="!['OVERDUE'].includes(row.urgency) && row.finish === '0'"
          v-allow="'c38826ada921427386ea564d1e22c22e'"
          type="primary"
          link
          @click="() => editRecordFn(row)"
        >
          编辑记录
        </el-button>
        <el-button
          v-allow="'ecffee4ca0d146c4863f71465ab5e06b'"
          type="primary"
          link
          @click="() => detailFn(row, 'detail')"
        >
          详情
        </el-button>
        <el-button
          v-allow="'fed33dba38bd4f6fa5ad940a35c02ca0'"
          type="success"
          link
          @click="() => detailFn(row, 'priview')"
        >
          预览
        </el-button>
        <el-button
          v-allow="'9293c0ae670b4f29b3890c560594d52f'"
          type="warning"
          link
          @click="() => operationRecordsFn(row)"
        >
          操作记录
        </el-button>
        <el-button
          v-allow="'ecffee4ca0d146c4863f71465ab5e06b'"
          type="success"
          link
          @click="() => handleDownContractFile(row)"
        >
          下载合同附件
        </el-button>
      </template>
    </BasePage>
    <ModalEdit
      v-model="showModel"
      :type="modalType"
      :row="showModelRow"
    ></ModalEdit>
    <ModalDetail
      v-model="showDetail"
      :type="modalType"
      :row="showModelRow"
    ></ModalDetail>
    <ModalOperation
      v-model="showOperation"
      :row="showModelRow"
    ></ModalOperation>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import FileSaver from 'file-saver';

import BasePage from '@/components/BasePage/index';
import { exportExcel } from '@/utils/fn.js';
import {
  ApiListContractPage,
  ApiDownloadContractNo,
} from '@/http/contract/contractManagement';
import ModalEdit from './ModalEdit.vue';
import ModalDetail from './ModalDetail.vue';
import ModalOperation from './ModalOperation.vue';
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
    name: '导出台账',
    attrs: {
      type: 'success',
    },
    clickFn: () => downloadFn(),
  },
]);

const modalType = ref('');
// 编辑/编辑记录 弹框
const showModel = ref(false);
const showModelRow = ref();
// 详情弹框
const showDetail = ref(false);
// 操作记录
const showOperation = ref(false);

const addFn = () => {
  modalType.value = 'add';
  showModel.value = true;
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

const detailFn = (row, type) => {
  modalType.value = type;
  showModelRow.value = row;
  showDetail.value = true;
};

const operationRecordsFn = (row) => {
  showModelRow.value = row;
  showOperation.value = true;
};

const downloadFn = async () => {
  try {
    const data = await ApiListContractPage({
      pageSize: 1e5,
    });
    if (data.total > 1e5) {
      ElMessage.warning('最多支持导出10万条数据！');
    }
    exportExcel(data.list, `合同${Date.now()}.xlsx`, columns);
  } catch (error) {
    ElMessage.error(`${error}`);
  }
};

/** 合同附件下载 */
const handleDownContractFile = async (row) => {
  try {
    await ElMessageBox.confirm('合同附件下载，确认是否继续？', '操作提示', {
      type: 'warning',
    });
    FileSaver.saveAs(
      ApiDownloadContractNo(row.contractNo),
      `${row.contractName}附件${Date.now()}`
    );
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
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
