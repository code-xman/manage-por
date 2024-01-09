// HTTP 请求封装
import axios from 'axios';
import { HTTP_CONFIG } from '@/config/base';
import { clearAuth, getAuthToken } from '@/utils/auth';

// 参数配置
axios.defaults.baseURL = HTTP_CONFIG.baseUrl;
axios.defaults.timeout = HTTP_CONFIG.timeout;
axios.defaults.withCredentials = false; // 携带 cookie

// 配置合并
const _axios = axios.create();
let loginRedirect = null;

// 退出登录
const _logout = () => {
  if (loginRedirect && typeof loginRedirect === 'number') {
    loginRedirect = clearTimeout(loginRedirect);
  }

  // 清除缓存的权限信息
  clearAuth();

  // 显示提示消息，并在指定时间后转到登录页
  loginRedirect = setTimeout(() => {
    ElMessage.error('登录状态无效，请重新登录');

    if (loginRedirect && typeof loginRedirect === 'number') {
      loginRedirect = clearTimeout(loginRedirect);
    }
    window.location.href = `/login`;
    // `/login?returnUrl=${encodeURIComponent(
    //   location.href
    // )}`;
  }, 300);
};

// 请求拦截器
_axios.interceptors.request.use(
  (config) => {
    if (!['/login'].includes(config.url)) {
      // 统一添加 Authorization，否则登录接口会出现偶尔的报错
      const token = getAuthToken();

      if (!token)
        throw {
          message: 'token 已过期，请重新登录',
        };

      if (config.headers) {
        config.headers.Authorization = token;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
_axios.interceptors.response.use(
  (response) => {
    const { data, code, message } = response.data;

    // 报表 老系统 判断 200
    if (code !== '00000' && code !== '200') {
      // token 过期或无效
      if ('401' === code) {
        // 清除登录信息，重新登录
        _logout();

        // 直接返回空操作，避免出现多个提示框
        return Promise.reject('请重新登录');
      }

      return Promise.reject(message || response.data.message);
    }

    return data;
  },
  (error) => {
    // 登录超时
    if (
      error.message.indexOf('timeout') !== -1 ||
      error.message.indexOf('timed out') !== -1
    ) {
      return Promise.reject('请求超时，请联系系统管理员');
    }

    // token 过期或无效
    if (
      error.message.indexOf('token') !== -1 ||
      error.message.indexOf('Token') !== -1
    ) {
      _logout();
      return {};
    }

    // 网络错误
    if (error.message === 'Network Error')
      return Promise.reject('网络错误，请稍后再试');

    return Promise.reject(error);
  }
);

// 请求封装
export const request = async (options) => await _axios.request(options);

// GET
export const get = (url, params, options) => {
  return request({
    ...options,
    url,
    params,
    method: 'GET',
  });
};

// POST
export const post = async (url, data, options) => {
  return await request({
    ...options,
    url,
    data,
    method: 'POST',
  });
};

// PUT
export const put = async (url, params, options) => {
  return await request({
    ...options,
    url,
    params,
    method: 'PUT',
  });
};

// PATCH
export const patch = async (url, params, options) => {
  return await request({
    ...options,
    url,
    params,
    method: 'PATCH',
  });
};

// DELETE
export const del = async (url, data, options) => {
  return await request({
    ...options,
    url,
    data,
    method: 'DELETE',
  });
};
