<template>
  <el-dialog
    v-model="modal"
    title="步骤节点配置"
    width="1000px"
    :close-on-click-modal="false"
    append-to-body
  >
    <div v-loading="pending" class="modal">
      <div class="modal-body">
        <BaseForm
          ref="BaseFormRef"
          v-model:formValue="formValue"
          :formItems="formRowItems"
          :rules="props.source === 'process' ? rules : {}"
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
import { ref, watch, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import BaseForm from '@/components/BaseForm';

import { getAuthUser } from '@/utils/auth';
import { parseToDate } from '@/utils/string';
import { ApiListUser } from '@/http/setting/user.js';
import {
  ApiEditProjectActConfig,
  ApiAddProjectActConfig,
  ApiWorkDay,
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
  source: {
    type: String,
    default: 'process',
  },
  indexNo: Number,
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

const rules = ref({
  actDefName: [{ required: true, message: '请输入步骤节点名称' }],
  assignee: [{ required: true, message: '请选择步骤负责人' }],
  actDefDesc: [{ required: true, message: '请输入步骤节点描述' }],
  startDate: [{ required: true, message: '请选择开始日期' }],
  workDays: [{ required: true, message: '请输入工期天数' }],
  attachmentName: [{ required: true, message: '请输入附件名称' }],
});

const handleSubmit = async () => {
  try {
    await BaseFormRef.value?.validate();
    const assigneeName =
      listUser.value?.find((lu) => lu.value === formValue.value.assignee)
        ?.label || '';
    const formVal = {
      ...formValue.value,
      indexNo: props.indexNo,
      assigneeName,
      completionDeadline: parseToDate(formValue.value.completionDeadline),
    };

    // 编辑项目
    if (props.type === 'editRecord') {
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

      // 开始日期
      const startDateItem = formRowItems.find((e) => e.name === 'startDate');
      if (startDateItem) {
        startDateItem.attrs['onBlur'] = handleEndDate;
      }
      // 工期天数
      const workDaysItem = formRowItems.find((e) => e.name === 'workDays');
      if (workDaysItem) {
        workDaysItem.attrs['onBlur'] = handleEndDate;
      }
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

const handleEndDate = async () => {
  try {
    pending.value = true;
    if (!formValue.value.workDays || !formValue.value.startDate) {
      formValue.value.completionDeadline = '';
      return;
    }
    const res = await ApiWorkDay({
      workDays: formValue.value.workDays,
      startDate: formValue.value.startDate,
    });
    formValue.value.completionDeadline = res.endDate;
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

onMounted(async () => {
  listUser.value = await ApiListUser({
    orgId: user.orgId,
  });
});
</script>
