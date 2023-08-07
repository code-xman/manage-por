<template>
  <div class="show-base-form flex-all column">
    <div class="flex-1">
      <BaseForm :formItems="formItems" v-model:formValue="formValue"></BaseForm>
    </div>
    <div class="btns">
      <el-button type="primary" @click="getFormData">获取数据</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseForm from './index.vue';

defineOptions({
  name: 'ShowBaseForm',
});

const formItems = [
  {
    name: 'name',
    label: '姓名',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'age',
    label: '年龄',
  },
  {
    name: 'sex',
    label: '性别',
  },
  {
    name: 'remark',
    label: '备注',
    className: 'full-width',
    attrs: {
      type: 'textarea',
      autosize: { minRows: 3, maxRows: 5 },
    },
  },
];

const formValue = ref({
  name: '',
  age: '',
  sex: '',
  remark: '',
});

const getFormData = () => {
  console.log('formValue :>> ', formValue.value);
};
</script>

<style lang="scss" scoped>

.btns {
  border-top: 1px solid $colorBorder;
  padding-top: 10px;
  text-align: right;
}
</style>
