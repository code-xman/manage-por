<template>
  <div class="show-base-table full">
    <BaseTable :columns="columns" :list="() => list" :options-size="100">
      <template #options="{ row }">
        <el-button
          type="primary"
          link
          @click="() => detailFn(row)"
        >
          详情
        </el-button>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseTable from '@/components/BaseTable/index';

defineOptions({
  name: 'ShowBaseTable',
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
      return row.sex || '-';
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
    sex: '男',
    address: '锁定季后赛冠军是的规划建设给',
    remark: '阿三大啊发发是潜伏期为富人请问·啊啊地方撒是否·的收到贵司的噶是',
  }
]);
const detailFn = (row) => {
  console.log('row :>> ', row);
}
</script>

<style lang="scss" scoped></style>
