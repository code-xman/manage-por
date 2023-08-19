export default [
  {
    path: '/stting',
    name: 'Stting',
    meta: {
      id: '50b5c64c3e094b6291cb5aa87c5d91f8',
      title: '设置',
      icon: 'icon-xitong',
    },
    component: () => import('@/layout/Main'),
    children: [
      {
        path: '/organ',
        name: 'Organ',
        meta: {
          id: '9abe0077698e43acafec3cad219bd79b',
          title: '机构管理',
        },
        component: () => import('@/pages/setting/organ/index.vue'),
      },
      {
        path: '/tenant',
        name: 'Tenant',
        meta: {
          id: '2d9721c4e6a14d99822daa64d0e1b17d',
          title: '租户管理',
        },
        component: () => import('@/pages/setting/tenant/index.vue'),
      },
      {
        path: '/department',
        name: 'Department',
        meta: {
          id: 'c29f9abb91d04bd0980bde9672617ba7',
          title: '部门管理',
        },
        component: () => import('@/pages/setting/department/index.vue'),
      },
      {
        path: '/resource',
        name: 'Resource',
        meta: {
          id: '4ec430e55f394581915fc1d379f279a5',
          title: '权限管理',
        },
        component: () => import('@/pages/setting/resource/index.vue'),
      },
      {
        path: '/role',
        name: 'Role',
        meta: {
          id: 'ab4672ea334649bc8f91b29cc93be93a',
          title: '角色管理',
        },
        component: () => import('@/pages/setting/role/index.vue'),
      },
      {
        path: '/user',
        name: 'User',
        meta: {
          id: 'bc8a8ffd2028414db1bbbce8fa084d9a',
          title: '用户管理',
        },
        component: () => import('@/pages/setting/user/index.vue'),
      },
    ],
  },
];
