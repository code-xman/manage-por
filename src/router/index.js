import { createRouter, createWebHashHistory } from 'vue-router';

import { getAuthMenu, getAuthUser } from '@/utils/auth';

const menus = getAuthMenu();
const menuIds = menus?.map((item) => item.menuId) || [];

const modules = import.meta.glob('./*.js', { eager: true });

console.groupCollapsed('自动注册的路由');

const routes = [];
const filterFn = (routers) => {
  let res = [];
  if (!routers?.length) {
    return [];
  }
  res = routers?.filter((r) => menuIds.includes(r.meta.id) || r.meta.id === true);
  res.forEach((item) => {
    if (item.children && item.children.length > 0) {
      item.children = filterFn(item.children);
    }
  });
  return res;
};
Object.keys(modules).forEach((filePath) => {
  const component = modules[filePath];
  // console.log(`${filePath} :>> `, component.default);
  let routerData = component.default;
  // 非开发环境
  if (import.meta.env.VITE_FLAG !== 'development') {
    // 去掉开发环境路由
    routerData = component.default.filter(
      (cd) => cd.meta.showType !== 'development'
    );
  }
  // 去掉无权限路由
  if (filePath !== './base.js') {
    routerData = filterFn(routerData);
  }
  console.log(`${filePath} :>> `, routerData);
  routes.push.apply(routes, routerData);
});

console.groupEnd();

// 实例化路由控制器
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 不校验登录的路由表
const WHITE_ROUTES = [
  'ContractDetailContent', // 合同详情
]

// 前置守卫
router.beforeEach((to) => {
  // 获取登录的用户信息
  const authUser = getAuthUser();

  // 是否存在重定向
  const route = router.getRoutes().find((set) => set.path === to.path);
  if (route && route?.redirect) {
    // 偶尔会出现无法重定向的问题，所以，这里手动检测一下
    return route;
  }

  if (to.name !== 'Login') {
    // 判断是否需要校验登录
    if (WHITE_ROUTES.includes(to.name?.toString())) {
      return true;
    } else {
      // 未登录时，跳转到登录页，否则显示目标页
      return authUser
        ? true
        : {
            name: 'Login',
            query: {
              // 如果因为登录失效导致跳转，则需要记录登录前的位置
              returnUrl: encodeURIComponent(location.href),
            },
          };
    }
  } else {
    // 已登录时，跳转到主页，否则显示登录页
    // const defaultRoute = getDefaultRoute();
    // return authUser && defaultRoute ? { name: defaultRoute } : true;
    return true;
  }
});

// 后置守卫
router.afterEach((to, from) => {});

export default router;
