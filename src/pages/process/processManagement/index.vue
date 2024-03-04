<template>
  <div class="process full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="ApiListProjectPage"
      :defaultParams="defaultParams"
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
          v-if="row.finish === '0'"
          v-allow="'9c3f6a07321747489f58afdcab2c262f'"
          type="primary"
          link
          @click="() => editRecordFn(row)"
        >
          编辑节点
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
    <el-dialog v-model="dialogVisible" title="模板选择">
      <div class="content p-20">
        <el-select v-model="temVal" placeholder="请选择模板" clearable>
          <el-option
            v-for="item in templates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="useTemConf"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <ModalEdit
      v-model="showModel"
      :type="modalType"
      :source="'process'"
      :row="showModelRow"
      :templateId="temVal"
    ></ModalEdit>
    <ModalDetail v-model="showDetail" :row="showModelRow"></ModalDetail>
    <!-- 操作记录 -->
    <ModalOperation
      v-model="showOperation"
      :row="showModelRow"
    ></ModalOperation>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { getAuthUser } from '@/utils/auth';

import BasePage from '@/components/BasePage/index';
import { exportExcel } from '@/utils/fn.js';
import { ApiDeptList } from '@/http/setting/department.js';
import {
  ApiListProjectPage,
  ApiListProject,
} from '@/http/process/processManagement.js';
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
// 分页默认参数
const defaultParams = ref({
  // 模板标识 1-是,0-否
  templateFlag: '0',
});
// 模板数据
const templates = ref([]);
// 模板选择弹框
const dialogVisible = ref(false);
// 选择的模板projectId
const temVal = ref('');
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
  dialogVisible.value = true;
};

const useTemConf = () => {
  if (!temVal.value) {
    ElMessage.warning('请选择模板');
    return;
  }
  modalType.value = 'copy';
  showModelRow.value = {
    projectId: temVal.value,
  };
  dialogVisible.value = false;
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
  () => searchFormValue.value.merchantId,
  async (value) => {
    searchFormValue.value.deptId = '';
    const item_deptId = searchFormItems.find((item) => item.name === 'deptId');
    if (!item_deptId) return;

    if (!value) {
      item_deptId.options = [];
    } else {
      const res = await ApiDeptList({ orgId: value });
      item_deptId.options = res || [];
    }
  }
);

watch(
  () => showModel.value,
  () => {
    if (!showModel.value) {
      BasePageRef.value?.refresh();
      temVal.value = '';
    }
  }
);

onMounted(async () => {
  try {
    // 获取模板数据
    templates.value = await ApiListProject({ templateFlag: '1' });
  } catch (error) {
    ElMessage.error(`${error}`);
  }
});
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
