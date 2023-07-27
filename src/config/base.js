// 应用基础信息
export const APP_INFO = {
  title: '项目 SaaS 服务平台',
};

// HTTP 配置
export const HTTP_CONFIG = {
  baseUrl: import.meta.env.VITE_HTTP_BASE_URL || '', // 后端接口地址
  timeout: 1000 * 60 * 15, // 接口请求超时时间，默认 15分钟，该参数可在具体的 http 请求方法中定义覆盖
};

// 默认缓存前缀，用户退出登录时不会被清除
export const CACHE_PREFIX = '__manage_saas';

// 敏感信息缓存，用户退出登录时，会被清除
export const CACHE_AUTH_PREFIX = `${CACHE_PREFIX}_auth`;
