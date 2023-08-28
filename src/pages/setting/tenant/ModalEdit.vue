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
        :formItems="formItems"
        v-model:formValue="formValue"
        :labelWidth="150"
        :rules="rules"
      ></BaseForm>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
        <el-button :disabled="pending" type="primary" @click="confirmClick">
          确定
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import BaseForm from '@/components/BaseForm';
import { modalTitleObj } from '@/data/common.js';
import {
  ApiOpenTenant,
  ApiEditTenant,
  ApiTenantInfo,
} from '@/http/setting/tenant.js';
import { formItems } from './data';

defineOptions({ name: 'TenantnModalEdit' });

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
  sysName: [{ required: true, message: '请输入系统名称' }],
});

const cancelClick = () => {
  emit('update:modelValue', false);
};

const confirmClick = async () => {
  try {
    pending.value = true;
    await BaseFormRef.value?.validate();
    const params = {
      bgColor: '#409EFF',
      ...formValue.value,
      pkId: props.row.pkId,
      logoFileName: '/vite.svg',
      icon: '/src/assets/vue.svg',
    };
    if (props.type === 'add') {
      await ApiOpenTenant(params);
    } else if (props.type === 'edit') {
      await ApiEditTenant(params);
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

const init = async () => {
  try {
    // 获取租户详情
    const res = await ApiTenantInfo({
      merchantId: props.row.merchantId,
      systemNo: props.row.systemNo,
    });
  } catch (error) {
    ElMessage.error(`${error}`);
  }
};

watch(
  () => props.modelValue,
  async () => {
    modal.value = props.modelValue;
    if (props.modelValue) {
      formValue.value = {
        companyName: props.row.companyName,
        creditCode: props.row.creditCode,
        sysName: props.row.sysName,
        systemNo: props.row.systemNo,
        bgColor: props.row.bgColor,
      };
      // await init();
    } else {
      formValue.value = {};
    }
  }
);
</script>

<style lang="scss" scoped>
:deep(.base-form) {
  
  .radio-slot {
    display: flex;
  }
}
</style>
