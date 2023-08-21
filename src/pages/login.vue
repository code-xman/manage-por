<template>
  <div class="login">
    <div class="login-box">
      <div class="img-box">
        <el-image class="img" src="/images/login.svg" fit="fill"></el-image>
      </div>
      <div v-loading="loading" class="form-box">
        <p>{{ APP_INFO.title }}</p>
        <el-form
          ref="formRef"
          :model="formVal"
          :rules="formRules"
          label-width="0"
        >
          <el-form-item prop="systemNo">
            <el-input
              v-model="formVal.systemNo"
              maxlength="32"
              placeholder="请输入系统编码"
              clearable
            />
          </el-form-item>
          <el-form-item prop="loginId">
            <el-input
              v-model="formVal.loginId"
              maxlength="50"
              placeholder="请输入登录名"
              clearable
            />
          </el-form-item>
          <el-form-item prop="loginPwd">
            <el-input
              v-model="formVal.loginPwd"
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
import { nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { APP_INFO, CACHE_PREFIX, CACHE_AUTH_PREFIX } from '@/config/base';
import { ApiLogin, ApiGetRules, ApiGetRegions } from '@/http/common';
import { setCache, getOSInfo, getBrowserInfo, encrypte } from '@/utils/common';
import { setAuthUser, setAuthToken, setAuthRole } from '@/utils/auth.js';
import { flattenTreeData } from '@/utils/array.js';

const router = useRouter();

const loading = ref(false);
const formRef = ref(null);
const formVal = ref({
  systemNo: '00000',
  loginId: 'sadmin',
  loginPwd: '123456',
});
const formRules = ref({
  systemNo: [{ required: true, message: '请输入系统编码' }],
  loginId: [{ required: true, message: '请输入登录名' }],
  loginPwd: [{ required: true, message: '请输入密码' }],
});

const loginFn = async () => {
  try {
    loading.value = true;
    await formRef.value.validate();
    const params = {
      ...formVal.value,
      loginPwd: encrypte(formVal.value.loginPwd),
      loginSys: getOSInfo(),
      loginBrowser: getBrowserInfo(),
    };
    const userData = await ApiLogin(params);
    const _user = {
      ...userData,
      systemNo: params.systemNo,
    };
    setAuthUser(_user); // 缓存账户信息
    setAuthToken(_user.tokenId); // 缓存 token 信息

    // 获取用户的权限信息
    const rules = await ApiGetRules(userData.userId);
    if (!rules.menu || !rules.menu.children.length)
      throw '该用户没有可用权限，请联系管理员';
    // 处理权限
    const _menus = flattenTreeData(rules.menu?.children || []);
    setAuthRole(_menus);

    // 初始化耗时数据
    // await ApiGetRegions();

    // 跳转页面
    router.replace({ name: 'Logging' });
  } catch (error) {
    console.log('error :>> ', error);
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
