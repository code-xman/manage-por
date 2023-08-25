import { CACHE_AUTH_PREFIX, CACHE_PREFIX } from '@/config/base';
import { getCache, removeCache, setCache } from '@/utils/common';

// 登录标识
const CACHE_FLAG_KEY = `${CACHE_AUTH_PREFIX}_flag`;

// 用户信息缓存标识
const CACHE_USER_KEY = `${CACHE_AUTH_PREFIX}_user`;

// token 信息缓存
const CACHE_TOKEN_KEY = `${CACHE_AUTH_PREFIX}_token`;

// 用户角色信息
const CACHE_ROLE_KEY = `${CACHE_AUTH_PREFIX}_role`;

// 用户菜单信息
const CACHE_MENU_KEY = `${CACHE_AUTH_PREFIX}_menu`;

// 用户按钮信息
const CACHE_BTN_KEY = `${CACHE_AUTH_PREFIX}_btn`;

////////////////////////////////////////////////////////////////

// 清除所有敏感信息
export const clearAuth = () => {
  Object.keys(localStorage).forEach((key) => {
    // 注意，不要清除 DataTable 组件的 cell 可见性配置
    if (key.startsWith(CACHE_PREFIX) && !key.includes('_columns__')) {
      removeCache(key);
    }
  });
};

///////////////////////////////////////////////////////////////

// 设置标识
export const setFlagUser = (flag) => {
  setCache(CACHE_FLAG_KEY, flag);
};

// 获取标识
export const getFlagUser = () => {
  return getCache(CACHE_FLAG_KEY);
};

// 清除标识
export const removeFlagUser = () => {
  removeCache(CACHE_FLAG_KEY);
};

////////////////////////////////////////////////////////////////

// 设置用户信息
export const setAuthUser = (user) => {
  setCache(CACHE_USER_KEY, user);
};

// 获取用户信息
export const getAuthUser = () => {
  return getCache(CACHE_USER_KEY);
};

// 清除用户信息
export const removeAuthUser = () => {
  removeCache(CACHE_USER_KEY);
};

////////////////////////////////////////////////////////////////

// 设置 token 信息
export const setAuthToken = (token) => {
  setCache(CACHE_TOKEN_KEY, token, 1000 * 60 * 60 * 8);
};

// 获取 token 信息
export const getAuthToken = () => {
  return getCache(CACHE_TOKEN_KEY);
};

// 清除 token 信息
export const removeAuthToken = () => {
  removeCache(CACHE_TOKEN_KEY);
};

////////////////////////////////////////////////////////////////

// 设置角色信息
export const setAuthRole = (roles) => {
  setCache(CACHE_ROLE_KEY, roles);
};

// 获取角色信息
export const getAuthRole = () => {
  return getCache(CACHE_ROLE_KEY);
};

// 清除角色信息
export const removeAuthRole = () => {
  removeCache(CACHE_ROLE_KEY);
};

////////////////////////////////////////////////////////////////

// 设置角色信息
export const setAuthMenu = (menus) => {
  setCache(CACHE_MENU_KEY, menus);
};

// 获取角色信息
export const getAuthMenu = () => {
  return getCache(CACHE_MENU_KEY);
};

// 清除角色信息
export const removeAuthMenu = () => {
  removeCache(CACHE_MENU_KEY);
};

////////////////////////////////////////////////////////////////

// 设置角色信息
export const setAuthBtn = (btns) => {
  setCache(CACHE_BTN_KEY, btns);
};

// 获取角色信息
export const getAuthBtn = () => {
  return getCache(CACHE_BTN_KEY);
};

// 清除角色信息
export const removeAuthBtn = () => {
  removeCache(CACHE_BTN_KEY);
};
