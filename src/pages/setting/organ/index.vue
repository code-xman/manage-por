<template>
  <div v-loading="pending" class="merchant full">
    <BasePage
      ref="BasePageRef"
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="ApiListMerchantPage"
      :options-size="140"
    >
      <template #options="{ row }">
        <el-button type="primary" link @click="() => editFn(row)">
          编辑
        </el-button>
        <template v-if="row.merchantStatus">
          <el-button
            v-if="row.merchantStatus === '02'"
            link
            @click="handleToggleRow(row)"
          >
            <span class="color-success">启用</span>
          </el-button>
          <el-button v-else link @click="handleToggleRow(row)">
            <span class="color-danger">禁用</span>
          </el-button>
        </template>
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
  ApiListMerchantPage,
  ApiChangeMerchantStatus,
} from '@/http/setting/organ.js';
import ModalEdit from './ModalEdit.vue';
import { columns, searchFormItems } from './data';

defineOptions({
  name: 'Organ',
});

const pending = ref(false);
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

/** 启用 / 禁用 */
const handleToggleRow = async (row) => {
  try {
    pending.value = true;
    await ElMessageBox.confirm(
      `${row.merchantStatus === '01' ? '禁用' : '启用'}${
        row.merchantName || '此项'
      }，确认是否继续？`,
      {
        type: 'warning',
        title: '操作提示',
        closeOnClickModal: false,
      }
    );

    await ApiChangeMerchantStatus({
      merchantId: row.merchantId,
      // 冻结传1  解冻传0
      freeze: row.merchantStatus === '01' ? '1' : '0',
    });
    BasePageRef.value?.refresh();
    ElMessage.success('操作成功');
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
