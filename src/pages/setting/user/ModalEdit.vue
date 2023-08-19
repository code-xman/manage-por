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
        <el-button :disabled="pending" type="primary" @click="confirmClick">
          确定
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import BaseForm from '@/components/BaseForm';
import { modalTitleObj } from '@/data/common.js';
import { isMobile, isIDCard } from '@/utils/validate.js';
import { ApiQueryAllChildMerchantMini } from '@/http/setting/organ';
import { ApiDeptList } from '@/http/setting/department.js';
import { ApiFindEnableRoleList } from '@/http/setting/role.js';
import {
  ApiCreateUser,
  ApiUpdateUser,
  ApiFindUserByUserId,
} from '@/http/setting/user.js';
import { formItems as formItemsData } from './data';

import { getAuthUser } from '@/utils/auth';
const user = getAuthUser();

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

const organs = ref([]);

const pending = ref(false);
const BaseFormRef = ref(null);
const formItems = ref([...formItemsData]);
const defaultFormValue = {
  // 3-当前职能部门
  authType: '3',
};
const formValue = ref({ ...defaultFormValue });

const mobileValidate = (rule, value, callback) => {
  if (isMobile(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的手机号'));
  }
};
const idNoValidate = (rule, value, callback) => {
  if (isIDCard(value)) {
    callback();
  } else {
    callback(new Error('请输入正确的身份证号'));
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
  idNo: [
    { required: true, message: '请输入身份证号' },
    { validator: idNoValidate },
  ],
  roleIds: [{ required: true, message: '请选择岗位角色' }],
});

const cancelClick = () => {
  emit('update:modelValue', false);
};

const confirmClick = async () => {
  try {
    pending.value = true;
    await BaseFormRef.value?.validate();
    const orgName = organs.value.find(
      (item) => item.value === formValue.value.orgId
    )?.label;
    if (props.type === 'add') {
      await ApiCreateUser({ ...formValue.value, orgName });
    } else if (props.type === 'edit') {
      await ApiUpdateUser({
        ...formValue.value,
        orgName,
        userId: props.row.userId,
      });
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

const formatFormItem = async () => {
  try {
    pending.value = true;
    // 所属机构
    const item_orgId = formItems.value?.find((item) => item.name === 'orgId');
    if (item_orgId) {
      item_orgId.options = organs.value;
    }
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
};

// 监听机构变化
watch(
  () => formValue.value.orgId,
  async (val) => {
    try {
      /** 职能部门 */
      const item_departmentId = formItems.value?.find(
        (item) => item.name === 'departmentId'
      );
      /** 岗位角色 */
      const item_roleIds = formItems.value?.find(
        (item) => item.name === 'roleIds'
      );

      if (val) {
        if (item_departmentId) {
          item_departmentId.options = await ApiDeptList({
            orgId: formValue.value.orgId,
          });
          item_departmentId.attrs.disabled = false;
        }

        if (item_roleIds) {
          item_roleIds.options = await ApiFindEnableRoleList({
            orgId: formValue.value.orgId,
          });
        }
      } else {
        if (item_departmentId) {
          formValue.value.departmentId = '';
          item_departmentId.attrs.disabled = true;
        }
      }
    } catch (error) {
      ElMessage.error(`${error}`);
    }
  }
);

// 监听弹框打开关闭
watch(
  () => props.modelValue,
  async () => {
    try {
      modal.value = props.modelValue;
      // 打开
      if (props.modelValue) {
        formatFormItem();
        // 修改
        if (props.row.userId) {
          const detail = await ApiFindUserByUserId({
            userId: props.row.userId,
          });
          formValue.value = {
            ...defaultFormValue,
            orgId: detail?.orgId || '',
            departmentId: detail?.znDeptId || '',
            loginId: detail?.loginId || '',
            userName: detail?.userName || '',
            workStatus: detail?.workStatus?.value || '',
            isLeader: detail?.isLeader?.value || '',
            isSalesMan: detail?.isSalesMan?.value || '',
            mobile: detail?.mobile || '',
            idNo: detail?.idNo || '',
            roleIds: detail?.roleIds || [],
          };
        }
      } else {
        // 关闭
        formValue.value = { ...defaultFormValue };
      }
    } catch (error) {
      ElMessage.error(`${error}`);
    }
  }
);

onMounted(async () => {
  try {
    pending.value = true;
    organs.value = await ApiQueryAllChildMerchantMini({
      merchantId: user.orgId,
    });
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
