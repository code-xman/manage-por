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
        <el-button
          v-allow="'9d37b0aa0b9843368dcc7743acda709c'"
          type="primary"
          link
          @click="() => editFn(row)"
        >
          编辑
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
    allow: 'b11afc3b734f42e7816525882c45f70c',
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
