<template>
  <div class="show-base-page full">
    <BasePage
      :searchFormItems="searchFormItems"
      v-model:searchFormValue="searchFormValue"
      :btns="btns"
      :columns="columns"
      :list="() => list"
      :options-size="100"
      @on-search="onSearchFn"
    >
      <template #options="{ row }">
        <el-button type="primary" link @click="() => detailFn(row)">
          详情
        </el-button>
      </template>
    </BasePage>
    <ShowModal v-model="showModel" :row="showModelRow"></ShowModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BasePage from '@/components/BasePage/index';
import ShowModal from './ShowModal.vue';
import { sexs } from './data';

defineOptions({
  name: 'ShowBasePage',
});

const columns = ref([
  {
    type: 'index',
    label: '#',
    fixed: 'left',
  },
  {
    prop: 'name',
    label: '名称',
    width: '150px',
    formatter(row) {
      return row.name || '-';
    },
  },
  {
    prop: 'sex',
    label: '性别',
    width: '80px',
    formatter(row) {
      return sexs.find((item) => item.value === row.sex)?.label || '-';
    },
  },
  {
    prop: 'address',
    label: '地址',
    minWidth: '180px',
    formatter(row) {
      return row.address || '-';
    },
  },
  {
    prop: 'remark',
    label: '备注',
    minWidth: '220px',
    formatter(row) {
      return row.remark || '-';
    },
  },
]);
const list = ref([
  {
    name: '张三',
    sex: 'man',
    address: '锁定季后赛冠军是的规划建设给',
    remark: '阿三大啊发发是潜伏期为富人请问·啊啊地方撒是否·的收到贵司的噶是',
  },
  {
    name: '李四',
    sex: 'woman',
    address: '阿瑟帝国收到贵司的噶三个',
    remark: '阿斯顿发卡机非把交罚款发噶咖啡馆就实打实的给阿桑的歌',
  },
]);

const searchFormItems = [
  {
    name: 'name',
    label: '姓名',
    style: {
      width: '300px',
    },
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'age',
    label: '年龄',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'sex',
    label: '性别',
    type: 'select',
    options: sexs,
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'filed1',
    label: '搜索字段搜索字段',
    style: {
      width: '320px',
    },
    attrs: {
      initHide: true,
      clearable: true,
    },
  },
  {
    name: 'filed2',
    label: '搜索字段',
    attrs: {
      initHide: true,
      clearable: true,
    },
  },
  {
    name: 'filed3',
    label: '搜索字段',
    attrs: {
      initHide: true,
      clearable: true,
    },
  },
  {
    name: 'filed4',
    label: '搜索字段',
    attrs: {
      initHide: true,
      clearable: true,
    },
  },
];

const searchFormValue = ref({
  name: '',
  age: '',
  sex: '',
});

const btns = ref([
  {
    key: 'add',
    name: '新增',
    attrs: {
      type: 'primary',
    },
    clickFn: () => addFn()
  },
  {
    key: 'import',
    name: '导入',
    attrs: {
      type: 'success',
    },
    clickFn: () => addFn()
  },
  {
    key: 'export',
    name: '导出',
    attrs: {
    },
    clickFn: () => addFn()
  },
]);

// 新增
const addFn = () => {
  console.log('新增');
}

const showModel = ref(false);
const showModelRow = ref({});

const onSearchFn = () => {
  console.log('searchFormValue :>> ', searchFormValue.value);
};

const detailFn = (row) => {
  showModelRow.value = row;
  showModel.value = true;
};
</script>

<style lang="scss" scoped></style>
