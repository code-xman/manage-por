<template>
  <el-dialog
    v-model="modal"
    title="步骤节点配置"
    width="900px"
    :close-on-click-modal="false"
    append-to-body
  >
    <div v-loading="pending" class="modal">
      <div class="modal-body">
        <BaseForm
          ref="BaseFormRef"
          v-model:formValue="formValue"
          :formItems="formRowItems"
          :rules="rules"
        ></BaseForm>
      </div>
      <div class="modal-footer">
        <el-button :disabled="pending" @click="modal = false"> 取消</el-button>
        <el-button type="primary" :disabled="pending" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import BaseForm from '@/components/BaseForm';

import { getAuthUser } from '@/utils/auth';
import { parseToDate } from '@/utils/string';
import { ApiListUser } from '@/http/setting/user.js';
import {
  ApiEditProjectActConfig,
  ApiAddProjectActConfig,
} from '@/http/process/processManagement.js';
import { formRowItems } from './data';

defineOptions({ name: 'ModalRowEdit' });

const user = getAuthUser();

const emit = defineEmits(['update:modelValue', 'update']);
const props = defineProps({
  modelValue: Boolean,
  projectId: String,
  type: {
    type: String,
    default: 'detail',
  },
  row: {
    type: Object,
    default: () => ({}),
  },
});

const modal = ref(false);
const pending = ref(false);
const listUser = ref([]);
const BaseFormRef = ref(null);
const formValue = ref({});

// 时间验证
const TimeValiate = (rule, value, callback) => {
  if (formValue.value?.completionDeadline || formValue.value?.durationDays) {
    callback();
  }
  callback(new Error('请选择完成时限或者输入工期天数'));
};

const rules = ref({
  actDefName: [{ required: true, message: '请输入步骤节点名称' }],
  assignee: [{ required: true, message: '请选择步骤负责人' }],
  actDefDesc: [{ required: true, message: '请输入步骤节点描述' }],
  completionDeadline: [{ validator: TimeValiate }],
  durationDays: [{ validator: TimeValiate }],
});

const handleSubmit = async () => {
  try {
    await BaseFormRef.value?.validate();
    const assigneeName =
      listUser.value?.find((lu) => lu.value === formValue.value.assignee)
        ?.label || '';
    const formVal = {
      ...formValue.value,
      assigneeName,
      completionDeadline: parseToDate(formValue.value.completionDeadline),
    };

    // 编辑项目
    if (props.type === 'edit') {
      if (!!props.row.actDefId) {
        // 编辑步骤
        await ApiEditProjectActConfig(formVal);
      } else {
        // 新增步骤
        await ApiAddProjectActConfig({
          ...formVal,
          projectId: props.projectId,
        });
      }
      ElMessage.success('保存成功');
    }
    emit('update', formVal);
    emit('update:modelValue', false);
  } catch (error) {
    if (error === 'cancel') return;
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

watch(
  () => props.modelValue,
  (value) => {
    modal.value = value;
    if (value) {
      formValue.value = props.row;
    }
  }
);

watch(
  () => modal.value,
  (value) => {
    if (!value) {
      formValue.value = {};
      emit('update:modelValue', value);
    }
    BaseFormRef.value?.resetFields();
  }
);

// 监听完成时限
watch(
  () => formValue.value.completionDeadline,
  (val) => {
    BaseFormRef.value?.validateField('durationDays');
    if (val) {
      formValue.value.durationDays = null;
    }
  }
);

// 监听工期天数
watch(
  () => formValue.value.durationDays,
  (val) => {
    BaseFormRef.value?.validateField('completionDeadline');
    if (val) {
      formValue.value.completionDeadline = null;
    }
  }
);

onMounted(async () => {
  listUser.value = await ApiListUser({
    orgId: user.orgId,
  });
});
</script>
