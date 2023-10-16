<template>
  <div class="home flex-1">
    <div>{{ user.userName }}，你好！</div>
    <div class="content">
      <ItemCountCard :data="list" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, } from 'vue';
import { ApiListTodo } from '@/http/process/processManagement.js';
import { getAuthUser } from '@/utils/auth';

const user = getAuthUser();

const list = ref([
  {
    icon: 'icon-gongzuoliu',
    name: '项目待办任务量',
    value: 0,
    route: 'ProcessTasks', // 路由 name
  },
  {
    icon: 'icon-xiangmuguidang',
    name: '合同待办任务量',
    value: 0,
    route: 'ContractManagement', // 路由 name
  },
]);

onMounted(async () => {
  const processRes = await ApiListTodo({
    taskStatus: 'WAIT',
    userId: user.userId,
  });
  list.value[0].value = processRes.total;
});
</script>

<style lang="scss" scoped>
.home {
  font-weight: bold;
  .content {
    margin-top: 20px;
  }
}
</style>
