<template>
  <div class="merchant full">
    <BasePage
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="ApiListTenantPage"
      :options-size="100"
    >
      <template #options="{ row }">
        <el-button type="primary" link @click="() => editFn(row)">
          编辑
        </el-button>
      </template>
    </BasePage>
    <ModalEdit v-model="showModel" :type="modalType" :row="showModelRow"></ModalEdit>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BasePage from '@/components/BasePage/index';
import { ApiListTenantPage } from '@/http/setting/tenant.js';
import ModalEdit from './ModalEdit.vue';
import { columns, searchFormItems } from './data';

defineOptions({
  name: 'ShowBasePage',
});

const searchFormValue = ref({});

const btns = ref([
  // {
  //   key: 'add',
  //   name: '新增',
  //   attrs: {
  //     type: 'primary',
  //   },
  //   clickFn: () => addFn(),
  // },
]);

const modalType = ref('');
const showModel = ref(false);
const showModelRow = ref({});

const addFn = () => {
  modalType.value = 'add'
  showModelRow.value = {};
  showModel.value = true;
}

const editFn = (row) => {
  modalType.value = 'edit'
  showModelRow.value = row;
  showModel.value = true;
};

</script>

<style lang="scss" scoped></style>
