<template>
  <el-drawer
    v-model="modal"
    title="详情"
    size="90%"
    append-to-body
    destroy-on-close
    class="my-drawer"
    @close="onCloseFn"
  >
    <div class="content">
      <BaseForm :formItems="formItems" v-model:formValue="formValue"></BaseForm>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseForm from '@/components/BaseForm';
import { sexs } from './data';

defineOptions({name: 'BasePageShowModal'})

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: Boolean,
  row: {
    type: Object,
    default: () => ({}),
  },
});

const modal = ref(false);

const formItems = [
  {
    name: 'name',
    label: '姓名',
    attrs: {
      clearable: true,
    },
  },
  {
    name: 'sex',
    label: '性别',
    type: 'select',
    options: sexs,
  },
  {
    name: 'address',
    label: '地址',
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
const formValue = ref({});

const cancelClick = () => {
  emit('update:modelValue', false);
};

const confirmClick = () => {
  emit('update:modelValue', false);
};

const onCloseFn = () => {
  emit('update:modelValue', false);
};

watch(
  () => props.modelValue,
  () => {
    modal.value = props.modelValue;
    if (props.modelValue) {
      formValue.value = props.row;
    } else {
      formValue.value = {};
    }
  }
);
</script>

<style lang="scss" scoped></style>
