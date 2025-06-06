/** 手动实现深克隆 */
function deepClone(obj) {
  // 类型检查
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // 数组处理
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // 对象处理
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}
