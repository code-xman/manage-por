<template>
  <el-dialog
    v-model="modal"
    title="修改密码"
    width="540px"
    :close-on-click-modal="false"
    append-to-body
  >
    <div v-loading="pending" class="modal">
      <div class="modal-body">
        <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-width="120px"
          style="padding-top: 15px; padding-right: 60px"
        >
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input
              v-model="form.oldPwd"
              type="password"
              placeholder="请输入旧密码"
              maxlength="32"
              show-password
              clearable
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input
              v-model="form.newPwd"
              type="password"
              placeholder="请输入新密码"
              maxlength="32"
              show-password
              clearable
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPwd">
            <el-input
              v-model="form.confirmPwd"
              type="password"
              placeholder="请再次输入新密码"
              maxlength="32"
              show-password
              clearable
            />
          </el-form-item>
        </el-form>
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
import { ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ApiChangePassword } from '@/http/common.js';
import { clearAuth, getAuthUser } from '@/utils/auth';
import { encrypte } from '@/utils/common';

defineOptions({ name: 'ModalModifyPassword' });

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Boolean,
});
const _passwordRule = {
  pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,20}$/,
  message: '密码必需包含大小写字母、数字,长度6-20',
};

const modal = ref(false);
const pending = ref(false);
const formRef = ref(null);
const form = ref({});
const rules = ref({
  oldPwd: [{ required: true, message: '请输入旧密码' }, ],
  newPwd: [{ required: true, message: '请输入新密码' }, _passwordRule],
  confirmPwd: [{ required: true, message: '请再次输入新密码' }, _passwordRule],
});

const handleSubmit = async () => {
  try {
    // 表单校验
    await new Promise((resolve, reject) => {
      formRef.value?.validate((valid) => {
        valid ? resolve(true) : reject('cancel');
      });
    });

    await ElMessageBox.confirm('确定保存当前修改？', '操作提示', {
      type: 'warning',
    });

    pending.value = true;

    const user = getAuthUser();
    // 加密处理
    const _params = {
      userId: user.userId,
      oldPwd: encrypte(form.value.oldPwd),
      newPwd: encrypte(form.value.newPwd),
      confirmPwd: encrypte(form.value.confirmPwd),
    };

    await ApiChangePassword(_params);

    ElMessage({
      type: 'success',
      message: '密码更新成功，请重新登录',
      duration: 1000,
      onClose: async () => {
        // ApiLogout();
        clearAuth();
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 600);
        });
        window.location.href = '/login';
      },
    });
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
  }
);

watch(
  () => modal,
  (value) => {
    form.value = {};
    emit('update:modelValue', value);
  }
);
</script>
