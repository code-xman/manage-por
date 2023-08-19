<template>
  <div v-loading="pending" class="logging flex-all center">登录中...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { setFlagUser, getFlagUser } from '@/utils/auth.js';
import { ElMessage } from 'element-plus';

const router = useRouter();

const pending = ref(false);

onMounted(() => {
  try {
    pending.value = true;

    const flag = getFlagUser();
    // 跳转页面
    if (!flag) {
      setFlagUser(true);
      window.location.reload();
    } else {
      setFlagUser(false);
      ElMessage.success('登录成功');
      router.replace({ name: 'Organ' });
    }
  } catch (error) {
    ElMessage.error(`${error}`);
  } finally {
    pending.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
