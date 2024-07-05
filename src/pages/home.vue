<template>
  <div class="home flex-1">
    <div class="content flex column " >
      <div>{{ user.userName }}，你好！</div>
      <div class="items flex-1">
        <ItemCountCard :data="list" />
      </div>
    </div>
    <img class="home-bg" src="/images/home-bg.jpg" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ApiListTodo } from '@/http/process/processManagement.js';
import { ApiListContractPage } from '@/http/contract/contractManagement';
import { getAuthUser } from '@/utils/auth';
import ItemCountCard from '@/components/ItemCountCard.vue';

const user = getAuthUser();

const list = ref([
  {
    icon: 'icon-gongzuoliu',
    name: '项目待办任务量',
    type: 'WAIT',
    value: 0,
    route: 'ProcessTasks', // 路由 name
  },
  {
    icon: 'icon-xiangmupingshen',
    name: '项目退回任务量',
    type: 'BACK',
    value: 0,
    route: 'ProcessTasks', // 路由 name
  },
  {
    icon: 'icon-xiangmuguidang',
    name: '合同待办任务量',
    type: 'Contract',
    value: 0,
    route: 'ContractManagement', // 路由 name
  },
]);

onMounted(async () => {
  const processRes = await ApiListTodo({
    pageSize: 1e5,
    taskStatus: 'WAIT',
    userId: user.userId,
  });
  list.value[0].value = processRes?.total || 0;

  // 退回任务数量请求
  const backRes = await ApiListTodo({
    pageSize: 1e5,
    taskStatus: 'BACK',
    userId: user.userId,
  });
  list.value[1].value = backRes?.total || 0;

  const contractRes = await ApiListContractPage({
    pageSize: 1e5,
    needSupply: '1',
  });
  list.value[2].value = contractRes?.total || 0;
});
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  font-weight: bold;
  .content {
    padding: 10px;
    height: 100%;
  }
  .items {
    margin-top: 20px;
  }
  .home-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: -1;
    opacity: 0.25;
  }
}
</style>
