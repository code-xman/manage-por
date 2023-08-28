<template>
  <div class="merchant full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="ApiPageRole"
      :options-size="120"
    >
      <template #options="{ row }">
        <el-button type="primary" link @click="() => editFn(row)">
          编辑
        </el-button>
        <el-button
          v-if="row.roleStatus.value === '01'"
          link
          plain
          @click="handleToggle(row)"
        >
          <span class="color-danger">禁用</span>
        </el-button>
        <el-button v-else  link plain @click="handleToggle(row)">
          <span class="color-success">启用</span>
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
import BasePage from '@/components/BasePage/index';
import {
  ApiPageRole,
  ApiEnableRole,
  ApiDisableRole,
} from '@/http/setting/role.js';
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
    attrs: {
      type: 'primary',
    },
    clickFn: () => addFn(),
  },
]);

const modalType = ref('');
const showModel = ref(false);
const showModelRow = ref({});

const addFn = () => {
  modalType.value = 'add';
  showModelRow.value = {};
  showModel.value = true;
};

const editFn = (row) => {
  modalType.value = 'edit';
  showModelRow.value = row;
  showModel.value = true;
};

// 启用或禁用角色
const handleToggle = async (role) => {
  try {
    const isDisabled = role.roleStatus.value === '01';

    const message = isDisabled
      ? '确定禁用该岗位角色？'
      : '确定启用该岗位角色？';

    await ElMessageBox.confirm(message, {
      title: '操作提示',
      type: 'warning',
      closeOnClickModal: false,
    });

    // 执行操作
    if (isDisabled) {
      await ApiDisableRole({ roleId: role.roleId });
    } else {
      await ApiEnableRole({ roleId: role.roleId });
    }

    // 刷新数据
    BasePageRef.value?.refresh();
  } catch (error) {
    if (error === 'cancel') return;
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
