<template>
  <div class="login">
    <div class="login-box">
      <div class="img-box">
        <el-image
          class="img"
          src="../../public/images/login.svg"
          fit="fill"
        ></el-image>
      </div>
      <div v-loading="loading" class="form-box">
        <p>{{ APP_INFO.title }}</p>
        <el-form
          ref="formRef"
          :model="formVal"
          :rules="formRules"
          label-width="0"
        >
          <el-form-item prop="name">
            <el-input
              v-model="formVal.name"
              maxlength="50"
              placeholder="请输入登录名"
              clearable
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formVal.password"
              type="password"
              show-password
              maxlength="20"
              placeholder="请输入密码"
              clearable
            />
          </el-form-item>
        </el-form>
        <el-button class="btn" type="primary" @click="loginFn">
          登录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { APP_INFO, CACHE_PREFIX, CACHE_AUTH_PREFIX } from '@/config/base';
import { setCache } from '@/utils/common';

const router = useRouter();

const loading = ref(false);
const formRef = ref(null);
const formVal = ref({
  name: '',
  password: '',
});
const formRules = ref({
  name: [{ required: true, message: '请输入登录名' }],
  password: [{ required: true, message: '请输入密码' }],
});

const loginFn = async () => {
  try {
    loading.value = true;
    await formRef.value.validate();
    console.log('formVal :>> ', formVal.value);
    // TODO: handle login
    setCache(`${CACHE_PREFIX}_logged_in`, true);
    router.replace({ name: 'Home' });
  } catch (error) {
    if (typeof error === 'string') {
      ElMessage.error(error);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(25deg, #8954df, #7976df, #6194de, #2fafdd);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  .login-box {
    border-radius: 10px;
    width: 50%;
    min-width: 200px;
    padding: $voidLarge;
    background: #fff;
    display: flex;
    .img-box {
      width: 50%;
      .img {
        width: 100%;
      }
    }
    .form-box {
      border-left: 1px solid $colorBorder;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      flex-direction: column;
      :deep(.el-form) {
        width: 90%;
        .el-input__inner {
          height: 40px;
        }
      }
      p {
        font-size: 20px;
        font-weight: bold;
      }
      .btn {
        width: 90%;
        height: 40px;
      }
    }
  }
}
</style>
