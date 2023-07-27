<template>
  <div class="header">
    <img class="logo" src="@/assets/vue.svg" />
    <div class="home item">{{ APP_INFO.title }}</div>
    <div v-if="route.meta.title" class="title">
      {{ route.meta.title || '' }}
    </div>
    <div class="flex-1"></div>
    <div class="item">个人中心</div>
    <div class="item">操作</div>
  </div>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { APP_INFO } from '@/config/base.js';

const route = useRoute();
const router = useRouter();
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  color: #fff;
  font-size: 16px;
  line-height: 56px;
  background-color: $colorPrimary;
  background-image: linear-gradient(
    to left,
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0) 50%
  );
  .logo {
    max-height: 100%;
    max-width: 100%;
  }

  .item {
    padding: 0 16px;
    cursor: pointer;
  }

  .home {
    font-weight: bold;
    font-size: 18px;
  }
  .title {
    width: 140px;
    padding: 0 16px;
    font-weight: 600;
  }
}
</style>
