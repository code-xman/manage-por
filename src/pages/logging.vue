<template>
  <div v-loading="true" class="logging flex-all center">登录中...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { setFlagUser, getFlagUser } from '@/utils/auth.js';
import { ElMessage } from 'element-plus';

const router = useRouter();

onMounted(() => {
  try {
    const flag = getFlagUser();
    // 跳转页面
    if (!flag) {
      setFlagUser(true);
      window.location.reload();
    } else {
      setFlagUser(false);
      ElMessage.success('登录成功');
      router.replace({ name: 'Home' });
    }
  } catch (error) {
    ElMessage.error(`${error}`);
  }
});
</script>

<style lang="scss" scoped></style>
