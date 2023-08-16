import JSEncrypt from 'jsencrypt';

/**
 * 本地缓存管理
 * 该缓存管理加入了缓存有效期的控制
 * 用法：
 * 设置缓存 CacheUtil.setCache('user', { username: 'admin' }, 1000 * 60 * 30)
 * 获取缓存 CacheUtil.getCache('user')
 * 移除缓存 CacheUtil.removeCache('user)
 */

/**
 * 设置缓存
 * @param {string} key 缓存标识
 * @param {any} data 缓存数据，如果是对象或数组，会单独处理
 * @param {number} expire 缓存有效期，单位 毫秒，不设置则表示永久有效
 */
export const setCache = (key, data, expire = undefined) => {
  if (data == undefined) return;

  const _expire = expire ? Math.abs(expire) : 0;
  const _now = new Date().valueOf();

  const _cache = {
    data,
    expire: expire ? _now + _expire : 0,
    expireAt: expire ? new Date(_now + _expire) : null,
    parse: false,
  };

  if (
    Array.isArray(data) ||
    Object.prototype.toString.call(data) === '[object Object]' ||
    Object.prototype.toString.call(data) === '[object Boolean]'
  ) {
    _cache.data = JSON.stringify(data);
    _cache.parse = true;
  }

  localStorage.setItem(key, JSON.stringify(_cache));
};

/**
 * 获取本地缓存
 * @param {string} key
 */
export const getCache = (key) => {
  const _cache = JSON.parse(localStorage.getItem(key) || '{}');
  if (!_cache.data) return null;

  if (_cache.expire && new Date().valueOf() > _cache.expire) {
    localStorage.removeItem(key);
    return null;
  }

  if (_cache.parse) return JSON.parse(_cache.data);

  return _cache.data;
};

// 移除缓存
export const removeCache = (key) => {
  localStorage.removeItem(key);
};

// 客户端信息处理
export const getOSInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  let name = 'Unknown';

  if (userAgent.indexOf('win') > -1) {
    name = 'Windows';
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac';
  } else if (
    userAgent.indexOf('x11') > -1 ||
    userAgent.indexOf('unix') > -1 ||
    userAgent.indexOf('sunname') > -1 ||
    userAgent.indexOf('bsd') > -1
  ) {
    name = 'Unix';
  } else if (userAgent.indexOf('linux') > -1) {
    name = 'Linux';
  } else {
    name = 'Unknown';
  }

  return name;
};

// 获取客户端浏览器
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;

  const isOpera = userAgent.indexOf('Opera') > -1;

  const isIE =
    userAgent.indexOf('compatible') > -1 &&
    userAgent.indexOf('MSIE') > -1 &&
    !isOpera;

  const isEdge = userAgent.indexOf('Edge') > -1;
  const isFF = userAgent.indexOf('Firefox') > -1;
  const isSafari =
    userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1;
  const isChrome =
    userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1;

  if (isIE) return 'IE';
  if (isOpera) return 'Opera';
  if (isEdge) return 'Edge';
  if (isFF) return 'FF';
  if (isSafari) return 'Safari';
  if (isChrome) return 'Chrome';
  return 'Unknown';
};

// JSEncrypt 加密
export const encrypte = (value) => {
  // 公钥
  const RAS_PUBLIC_KEY = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDpBCiWlxxa2ewMSvsf6Y1up2BMfM8DdG92lEO2u3u6JskQEdStkfeuVegKq0cMfEkz/QxpnkRReqrqaj2IXofu5NgDuWmhBKzENHN8Za/EnRHYhtfIg/1AddGBjAyvTyafxU3PaJmYnzMF6znzJE/6kIa63rFQfhpiCUt+A7E1HwIDAQAB`;
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(RAS_PUBLIC_KEY);
  return encryptor.encrypt(value) || '';
};
