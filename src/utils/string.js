
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import utc from 'dayjs/plugin/utc';

dayjs.locale('zh-cn');
dayjs.extend(utc);

// 金额处理方法

/**
 * 处理千分位使用
 * @param value
 * @param fixed
 * @returns
 */
export const amount = (value, fixed = 2) => {
  // 格式验证
  if (isNaN(+value) || value === null) return '-';

  // 转换为小数
  value = parseFloat(`${value}`.replace(/,/g, '')).toFixed(fixed);

  if (value.indexOf('.') == -1) {
    return value.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => {
      return s + ',';
    });
  }

  return value.replace(/(\d)(?=(\d{3})+\.)/g, (s) => {
    return s + ',';
  });
};

/**
 * @param data 需格式化的金额数据
 * @returns amount(data) | '-'
 */
export const formatAmount = (data) => {
  if (data === null || data === undefined) {
    return '-';
  }
  return amount(data);
};

// 格式化日期为年月日时分秒
export const parseToDatetime = (value) => {
  if (value === null) return value;
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
};

// 格式化日期为年月日
export const parseToDate = (value) => {
  if (value === null) return value;
  return dayjs(value).format('YYYY-MM-DD');
};

// 格式化日期为年
export const parseToYear = (value) => {
  if (value === null) return value;
  return dayjs(value).format('YYYY');
};

