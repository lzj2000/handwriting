/**
 * 需求理解
 *
 * 一、目标
 * 模拟instanceof操作符的内部实现机制

 * 二、功能要求
 *  - 获取当前类的原型和实例对象的原型链；
 *  - 沿着原型链向上查找；
 *  - 找到匹配的原型则返回true；
 *  - 查找到Object.prototype.__proto__为null时返回false。

 * 三、实现步骤
 *  1. 获取原型：获取构造函数的 prototype 属性和对象的原型链。
 *  2. 原型链遍历：沿着对象的原型链向上查找。
 *  3. 比较匹配：检查每一层原型是否与构造函数的 prototype 相等。
 *  4. 终止条件：找到匹配返回 true，到达原型链顶端返回 false。

 * 四、关键点说明
 *  - instanceof检查的是原型链上是否存在构造函数的prototype。
 *  - 需要处理null、undefined等边界情况。
 *  - 使用Object.getPrototypeOf()而不是__proto__属性。
 *  - 原型链的查找会一直到Object.prototype.__proto__(null)为止。
 */

/**
 * 手动实现 instanceof 机制
 * @param {Object} obj - 要检测的对象
 * @param {Function} constructorFn - 目标构造函数
 * @returns {boolean} - 是否在原型链中找到匹配
 */
function myInstanceof(obj, constructorFn) {
  // 处理基本类型和null
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  // 获取构造函数原型
  const prototype = constructorFn.prototype;

  // 原型链遍历
  let currentProto = Object.getPrototypeOf(obj);
  while (currentProto !== null) {
    if (currentProto === prototype) {
      return true;
    }
    currentProto = Object.getPrototypeOf(currentProto);
  }

  return false;
}

// 测试
// 测试用例
const testArray = [];
// 测试1：数组 instanceof Array
console.log("[] instanceof Array:", myInstanceof(testArray, Array)); // 应返回 true
// 测试2：数组 instanceof Object
console.log("[] instanceof Object:", myInstanceof(testArray, Object)); // 应返回 true
// 测试3：数组 instanceof String
console.log("[] instanceof String:", myInstanceof(testArray, String)); // 应返回 false

// 拓展：Symbol.hasInstance 支持
// JS 引擎规定了 Function.prototype[Symbol.hasInstance] 是不可被重新赋值的，但通过 Symbol.hasInstance，我们可以在定义类的时候，规定 instanceof 在自定义类上的行为。
function enhancedInstanceof(obj, constructorFn) {
  // 处理自定义Symbol.hasInstance
  if (typeof constructorFn[Symbol.hasInstance] === "function") {
    return constructorFn[Symbol.hasInstance](obj);
  }

  // 原有逻辑...
}
