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
          title: '项目流程管理',
        },
        component: () => import('@/pages/process/processManagement/index.vue'),
      },
    ],
  },
];
