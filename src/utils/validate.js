// 校验正则配置

// 判断是否为空
export const isEmpty = (params) => {
  if (params instanceof Array) {
    return params.length === 0;
  } else if (typeof params === 'object' && params) {
    return JSON.stringify(params) === '{}';
  }
  return ['', undefined, null].includes(params);
};

// 手机号校验 - 宽松校验，不支持【+86】
export const isMobile = (value) => {
  return /^1[3-9]\d{9}$/.test(value);
};
// 座机号码
export const isTel = (value) => {
  return /^0[0-9]{2,3}-[0-9]{7,8}$/.test(value);
};
// 座机或手机
export const isPhone = (value) => {
  return isMobile(value) || isTel(value);
};

// 是否统一社会信用代码，兼容 15 ~ 18位
export const isCreditCode = (value) => {
  // return /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/.test(
  //   value
  // );
  return /^[a-zA-Z0-9]{15,18}$/.test(value);
};

// 是否开户行号
export const isSubBankCode = (value) => {
  return value.length === 12;
};

// 是否身份证号，支持一代和二代身份证号
export const isIDCard = (value) => {
  return (
    /^[1-9]\d{7}(?:0\d|10|11|12)(?:0[1-9]|[1-2][\d]|30|31)\d{3}$/.test(value) ||
    /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(
      value
    )
  );
};

// 是否为连续的字母
export const isLetter = (value) => {
  return /^[a-zA-Z]+$/.test(value);
};

// 是否为邮箱
export const isEmail = (value) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value
  );
};

// 是否为银行卡号，覆盖对私对公¸
export const isBankCardNo = (value) => {
  return /^(\d+)$/g.test(value);
};

// 数字
export const isNumber = (value) => {
  if (isEmpty(value)) return false;
  return /^[0-9]+(\.[0-9]+)?$/.test(value);
};
