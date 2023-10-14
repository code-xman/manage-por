export default [
  {
    path: '/process',
    name: 'Process',
    meta: {
      id: '5809651e8055492dad5c8d59d5f65b76',
      title: '项目流程',
      icon: 'icon-gongzuoliu',
    },
    component: () => import('@/layout/Main'),
    children: [
      {
        path: '/processManagement',
        name: 'ProcessManagement',
        meta: {
          id: 'd0aac48fa8894a899cdadfe49aa8bf69',
          title: '项目管理',
        },
        component: () => import('@/pages/process/processManagement/index.vue'),
      },
      {
        path: '/processTasks',
        name: 'ProcessTasks',
        meta: {
          id: '82bc1ce3537949ceb4ee7a521d152e42',
          title: '项目任务',
        },
        component: () => import('@/pages/process/processTasks/index.vue'),
      },
    ],
  },
];
