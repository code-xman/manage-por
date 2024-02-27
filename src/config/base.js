// 应用基础信息
export const APP_INFO = {
  title: '项目 SaaS 服务平台',
};

// HTTP 配置
export const HTTP_CONFIG = {
  baseUrl: import.meta.env.VITE_HTTP_BASE_URL || '', // 后端接口地址
  timeout: 1000 * 60 * 15, // 接口请求超时时间，默认 15分钟，该参数可在具体的 http 请求方法中定义覆盖
};

// 文件上传配置
export const uploadAction = `${HTTP_CONFIG.baseUrl}/fileUpload/uploads`;
export const uploadHeaders = new Headers({});

// 默认缓存前缀，用户退出登录时不会被清除
export const CACHE_PREFIX = '__manage_saas';

// 敏感信息缓存，用户退出登录时，会被清除
export const CACHE_AUTH_PREFIX = `${CACHE_PREFIX}_auth`;

// 允许上传的文件格式
export const allowFiles = {
  image: '.jpg,.jpeg,.png,.gif,.webp,.svg',
  pdf: '.pdf',
  doc: '.doc,.docx',
  ppt: '.ppt,.pptx',
  excel: '.xls,.xlsx',
  video: '.wav,.mp3,.acc,.ogg,.midi,.wma,.m4a',
  audio: '.mp4,.avi,.mov,.rm,.rmvb,.swf',
  rar: 'rar,.zip,.tar,.iso,.7z,.gz,.bz2'
}