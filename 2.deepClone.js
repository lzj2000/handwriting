/**
 * 需求理解
 *
 * 一、目标
 * 实现一个递归深度克隆函数，创建对象的完全独立副本。

 * 二、功能要求
 *  - 层层拷贝对象或数组的每一层内容；
 *  - 使用递归实现深层遍历；
 *  - 处理基本数据类型和引用数据类型；
 *  - 确保克隆后的对象完全独立。

 * 三、实现步骤
 *  1. 递归思想：对于每个属性，如果是对象或数组，则递归调用深克隆函数。
 *  2. 类型判断：区分基本类型、数组和对象，采用不同的处理策略。
 *  3. 属性遍历：使用 for...in 循环遍历对象的所有可枚举属性，并使用 hasOwnProperty 确保只复制对象自身的属性。

 * 四、关键点说明
 *  - 使用递归思想处理嵌套结构。
 *  - 需要区分数组和对象的处理方式。
 *  - 使用 hasOwnProperty 确保只复制对象自身的属性。
 *  - 简易版不处理特殊对象类型和循环引用。
 */

/**
 * 手动实现深克隆
 * @param {Object|Array} obj - 需要拷贝的对象或数组
 * @returns {Object|Array} - 返回拷贝后的新对象或数组
 */
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

// 测试
const originalObj = {
  a: 1,
  b: {
    c: 2,
    d: [3, 4, { e: 5 }],
  },
};

// 测试1：验证深层嵌套对象的完全独立拷贝
const clonedObj = deepClone(originalObj);
console.log("原始对象:", originalObj);
console.log("克隆对象:", clonedObj);
console.log(
  "是否独立拷贝:",
  clonedObj !== originalObj &&
    clonedObj.b !== originalObj.b &&
    clonedObj.b.d !== originalObj.b.d &&
    clonedObj.b.d[2] !== originalObj.b.d[2]
); // 应输出 true

// 测试2：验证修改克隆对象不影响原对象的任何层级
clonedObj.a = 100;
clonedObj.b.c = 200;
clonedObj.b.d.push(6);
clonedObj.b.d[2].e = 500;
console.log("原始对象:", originalObj); // 应保持原样
console.log("克隆对象:", clonedObj); // 应显示修改后的值

// 预期结果验证
console.assert(originalObj.a === 1, "原始对象第一层属性不应改变");
console.assert(originalObj.b.c === 2, "原始对象第二层属性不应改变");
console.assert(originalObj.b.d.length === 3, "原始对象数组长度不应改变");
console.assert(originalObj.b.d[2].e === 5, "原始对象深层嵌套属性不应改变");

// 拓展：循环引用处理
/**
 * 增强版深克隆（支持循环引用和特殊对象）
 * @param {Object|Array} obj - 要克隆的对象
 * @param {WeakMap} [hash=new WeakMap()] - 用于检测循环引用
 * @returns {Object|Array} 克隆后的对象
 */
function enhancedDeepClone(obj, hash = new WeakMap()) {
  // 处理循环引用
  if (hash.has(obj)) return hash.get(obj);

  // 基本类型处理
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // 特殊对象处理
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  // 初始化克隆对象
  const clone = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, clone);

  // 递归克隆属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = enhancedDeepClone(obj[key], hash);
    }
  }

  return clone;
}
