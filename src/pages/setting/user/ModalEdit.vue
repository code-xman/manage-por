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
import { modalTitleObj } from '@/data/common.js';
import { isMobile } from '@/utils/validate.js';
import { ApiCreateUser, ApiUpdateUser } from '@/http/setting/user.js';
import { formItems } from './data';

defineOptions({ name: 'UserModalEdit' });

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

const mobileValidate = (rule, value, callback) => {
  if (isMobile(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的手机号'));
  }
};

const rules = ref({
  orgId: [{ required: true, message: '请选择所属机构' }],
  departmentId: [{ required: true, message: '请选择职能部门' }],
  loginId: [{ required: true, message: '请输入登录ID' }],
  userName: [{ required: true, message: '请输入用户姓名' }],
  workStatus: [{ required: true, message: '请选择工作状态' }],
  isLeader: [{ required: true, message: '请选择是否领导' }],
  isSalesMan: [{ required: true, message: '请选择是否业务员' }],
  mobile: [
    { required: true, message: '请输入联系电话' },
    { validator: mobileValidate },
  ],
  enableRoles: [{ required: true, message: '请选择岗位角色' }],
});

const cancelClick = () => {
  emit('update:modelValue', false);
};

const confirmClick = async() => {
  try {
    pending.value = true;
    await BaseFormRef.value?.validate();
    if (props.type === 'add') {
      await ApiCreateUser(formValue.value);
    } else if (props.type === 'edit') {
      await ApiUpdateUser(formValue.value);
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
      formValue.value = props.row;
    } else {
      formValue.value = {};
    }
  }
);
</script>

<style lang="scss" scoped></style>
