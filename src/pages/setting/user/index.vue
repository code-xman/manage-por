<template>
  <div v-loading="pending" class="merchant full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="ApiPageUser"
      :options-size="180"
    >
      <template #options="{ row }">
        <el-button type="primary" link @click="() => editFn(row)">
          编辑
        </el-button>
        <el-button
          v-if="row.userStatus.value === '02'"
          link
          @click="handleToggleRow(row)"
        >
          <span class="color-success">启用</span>
        </el-button>
        <el-button v-else link @click="handleToggleRow(row)">
          <span class="color-danger">禁用</span>
        </el-button>
        <el-button link :disabled="pending" @click="handleResetPassword(row)">
          <span class="color-warning">重置密码</span>
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
import { ElMessage, ElMessageBox } from 'element-plus';
import BasePage from '@/components/BasePage/index';
import {
  ApiPageUser,
  ApiDisableUser,
  ApiEnableUser,
  ApiResetPwd,
} from '@/http/setting/user.js';
import ModalEdit from './ModalEdit.vue';
import { columns, searchFormItems } from './data';

defineOptions({
  name: 'ShowBasePage',
});

const pending = ref(false);
const BasePageRef = ref({});
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

/** 启用 / 禁用 */
const handleToggleRow = async (row) => {
  try {
    pending.value = true;
    const isDisable = row.userStatus.value === '01';
    await ElMessageBox.confirm(
      `${isDisable ? '禁用' : '启用'}${row.userName || '此人'}，确认是否继续？`,
      {
        type: 'warning',
        title: '操作提示',
        closeOnClickModal: false,
      }
    );

    if (isDisable) {
      await ApiDisableUser({ userId: row.userId });
    } else {
      await ApiEnableUser({ userId: row.userId });
    }

    BasePageRef.value?.refresh();
    ElMessage.success('操作成功');
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

// 重置密码
const handleResetPassword = async (row) => {
  try {
    await ElMessageBox.confirm('确定重置当前用户密码？', {
      title: '操作提示',
      type: 'warning',
      closeOnClickModal: false,
    });
    pending.value = true;
    await ApiResetPwd({ userId: row.userId });

    ElMessage.success('操作成功');
    BasePageRef.value?.refresh();
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
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
