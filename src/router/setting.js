export default [
  {
    path: '/stting',
    name: 'Stting',
    meta: {
      title: '设置',
      icon: 'icon-xitong',
    },
    component: () => import('@/layout/Main'),
    children: [
      {
        path: '/organ',
        name: 'Organ',
        meta: {
          title: '机构管理',
        },
        component: () => import('@/pages/setting/organ/index.vue'),
      },{
        path: '/department',
        name: 'Department',
        meta: {
          title: '部门管理',
        },
        component: () => import('@/pages/setting/department/index.vue'),
      },
      {
        path: '/user',
        name: 'User',
        meta: {
          title: '用户管理',
        },
        component: () => import('@/pages/setting/user/index.vue'),
      },
      {
        path: '/role',
        name: 'Role',
        meta: {
          title: '角色管理',
        },
        component: () => import('@/pages/setting/role/index.vue'),
      },
    ],
  },
];
