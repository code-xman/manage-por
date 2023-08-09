import axios from 'axios';

// 配置合并
const _axios = axios.create();

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
