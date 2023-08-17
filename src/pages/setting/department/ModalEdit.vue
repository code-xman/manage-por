<template>
  <el-drawer
    v-model="modal"
    :title="modalTitle"
    size="90%"
    append-to-body
    destroy-on-close
    class="my-drawer"
    @close="onCloseFn"
  >
    <div v-loading="pending" class="content">
      <BaseForm
        ref="BaseFormRef"
        v-model:formValue="formValue"
        :formItems="formItems"
        :rules="rules"
      ></BaseForm>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
        <el-button :disabled="pending" type="primary" @click="confirmClick"
          >确定</el-button
        >
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import BaseForm from '@/components/BaseForm';
import {
  ApiDeptList,
  ApiCreateRoot,
  ApiCreateChild,
  ApiEdit,
} from '@/http/setting/department.js';
import { modalTitleObj } from '@/data/common.js';
import { formItems } from './data';

defineOptions({ name: 'DepartmentModalEdit' });

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: Boolean,
  type: {
    type: String,
    default: 'edit',
  },
  row: {
    type: Object,
    default: () => ({}),
  },
});

const modal = ref(false);
const modalTitle = computed(() => {
  return modalTitleObj[props.type];
});
const pending = ref(false);
const BaseFormRef = ref(null);
const formValue = ref({});

const rules = ref({
  departmentName: [{ required: true, message: '请输入部门名称' }],
});

const cancelClick = () => {
  emit('update:modelValue', false);
};

const confirmClick = async () => {
  try {
    pending.value = true;
    await BaseFormRef.value?.validate();
    if (props.type === 'add') {
      await ApiCreateRoot(formValue.value);
    }
    if (props.type === 'addSon') {
      await ApiCreateChild(formValue.value);
    }
    if (props.type === 'edit') {
      await ApiEdit(formValue.value);
    }

    ElMessage.success('保存成功');
    emit('update:modelValue', false);
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

const onCloseFn = () => {
  emit('update:modelValue', false);
};

watch(
  () => props.modelValue,
  () => {
    modal.value = props.modelValue;
    if (props.modelValue) {
      if (props.type === 'add') {
        formValue.value = {
          orgId: props.row.orgId,
        };
      }
      if (props.type === 'addSon') {
        formValue.value = {
          orgId: props.row.orgId,
          upDepartmentId: props.row.departmentId,
          departmentName: '',
        };
      }
      if (props.type === 'edit') {
        formValue.value = {
          orgId: props.row.orgId,
          upDepartmentId: props.row.upDepartmentId,
          departmentName: props.row.departmentName,
          departmentId: props.row.departmentId,
        };
      }
    } else {
      formValue.value = {};
    }
  }
);

watch(
  () => props.row,
  async () => {
    const item_upDepartmentId = formItems.find(
      (item) => item.name === 'upDepartmentId'
    );
    if (item_upDepartmentId) {
      item_upDepartmentId.options = await ApiDeptList({
        orgId: props.row.orgId,
      });
      item_upDepartmentId.attrs.placeholder = props.row.orgName;
    }
  }
);
</script>

<style lang="scss" scoped></style>
