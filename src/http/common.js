import { post } from '@/http';
import { CACHE_PREFIX } from '@/config/base';
import { getCache, setCache } from '@/utils/common';

// 获取全省市区数据，数据有缓存
export const ApiGetRegions = async () => {
  const _cacheKey = `${CACHE_PREFIX}_api_region`;
  const cache = getCache(_cacheKey);
  if (cache) return cache;
  const data = await post('/api/paramConfigFacade/queryAllAreas');
  setCache(
    _cacheKey,
    data.sort((a, b) => a.adcode - b.adcode)
  );
  return data.sort((a, b) => a.adcode - b.adcode);
};

// 登录用户
export const ApiLogin = async (params) => {
  return await post('/login', params);
};

// 退出登录
export const ApiLogout = async () => {
  const tokenId = getAuthToken();
  if (!tokenId) return;
  await post('/logout', { tokenId });
};

// 获取登录用户的权限和角色数据
export const ApiGetRules = async (userId) => {
  return await post('/api/userFacade/findOAuth', { userId });
};

// 修改密码
export const ApiChangePassword = async (params) => {
  await post('/api/userFacade/updateLoginPwd', params);
};
