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
