/**
 * 需求理解
 *
 * 一、目标：
 * 实现一个对对象或数组进行浅克隆的函数，返回一个新的对象或数组，
 * 仅复制第一层属性，不递归复制嵌套结构。
 *
 * 二、功能要求：
 * 1. 支持对象（Object）和数组（Array）类型的输入；
 * 2. 对基本类型（如 Number、String、Boolean、null、undefined）直接返回原值；
 * 3. 不复制嵌套对象/数组，保留其引用关系；
 * 4. 使用简洁高效的方式实现（如 ES6 扩展运算符）。
 *
 * 三、实现步骤：
 * 1. 类型判断：检查输入是否为 null 或非对象类型，若是则直接返回；
 * 2. 数组处理：使用扩展运算符 `[...obj]` 或 `slice()` 创建新数组；
 * 3. 对象处理：使用扩展运算符 `{...obj}` 或 `Object.assign({}, obj)` 创建新对象。
 *
 * 四、关键点说明：
 * - 浅克隆只复制顶层属性，嵌套结构仍指向原始数据；
 * - 必须区分对象与数组，避免类型错误；
 * - 推荐使用扩展运算符，代码简洁且可读性高；
 * - 注意处理边界情况，如 null、undefined 等。
 */

/**
 * 手动实现浅克隆
 * @param {any} obj 要克隆的目标对象或数组
 * @returns {any} 克隆后的新对象或数组
 */
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

// 测试
// 测试基本类型
console.log(shallowClone(123));       // 123
console.log(shallowClone("abc"));     // "abc"
console.log(shallowClone(null));      // null

// 测试数组
const arr = [1, 2, { a: 3 }];
const cloneArr = shallowClone(arr);
cloneArr[2].a = 99;
console.log(arr[2].a);        // 99，说明是浅克隆

// 测试对象
const obj = { x: 1, y: { z: 2 } };
const cloneObj = shallowClone(obj);
cloneObj.y.z = 99;
console.log(obj.y.z);         // 99，说明是浅克隆


// 拓展一：支持更多内置对象（如 Date、RegExp）
function enhancedShallowClone(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  if (Array.isArray(obj)) {
    return [...obj];
  }
  return { ...obj };
}

// 拓展二：兼容性写法（适用于不支持扩展运算符的环境）
function compatShallowClone(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.slice();
  }
  return Object.assign({}, obj);
}