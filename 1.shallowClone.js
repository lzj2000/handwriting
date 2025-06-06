/** 手动实现浅克隆 */
function shallowClone(obj) {
  // 类型检查
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  // 数组处理
  if (Array.isArray(obj)) {
    return [...obj];
  }
  // 对象处理
  return { ...obj };
}
