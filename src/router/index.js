import { createRouter, createWebHashHistory } from 'vue-router';

import { getAuthMenu } from '@/utils/auth.js';

const menus = getAuthMenu();
const menuIds = menus?.map((item) => item.menuId) || [];

const modules = import.meta.glob('./*.js', { eager: true });

console.groupCollapsed('自动注册的路由');

const routes = [];
const filterFn = (routers) => {
  let res = [];
  if (routers?.length === 0) {
    return [];
  }
  res = routers.filter((r) => menuIds.includes(r.meta.id));
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

// 前置守卫
router.beforeEach((to) => {
  return true;
});

// 后置守卫
router.afterEach((to, from) => {});

export default router;
