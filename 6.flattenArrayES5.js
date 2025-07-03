/**
 * 需求理解
 *
 * 一、目标
 * 使用ES5语法实现数组扁平化

 * 二、功能要求
 *  - 循环遍历数组中的每个元素；
 *  - 判断元素是否为数组类型；
 *  - 递归处理嵌套数组；
 *  - 将所有元素添加到新数组中。

 * 三、实现步骤
 *  1. 递归遍历：使用for循环遍历数组元素。
 *  2. 类型检查：使用Array.isArray检查是否为数组。
 *  3. 深度控制：通过参数控制递归深度。
 *  4. 结果收集：使用外部数组收集所有元素。

 * 四、关键点说明
 *  - 使用传统for循环实现数组遍历。
 *  - 通过递归处理嵌套数组结构。
 *  - 支持自定义扁平化深度控制。
 *  - 使用Array.isArray进行准确的类型检查。
 */

/**
 * ES5实现数组扁平化方法
 * @param {Array} arr - 要扁平化的数组
 * @param {number} [depth=Infinity] - 扁平化深度，默认为Infinity（完全扁平化）
 * @returns {Array} 扁平化后的新数组
 */
function flattenArray(arr, depth) {
  depth = typeof depth === "undefined" ? Infinity : depth;
  if (depth === 0) {
    return arr.slice();
  }

  var result = [];
  // 使用for循环遍历数组元素
  for (var i = 0; i < arr.length; i++) {
    // 使用Array.isArray检查是否为数组
    if (Array.isArray(arr[i]) && depth > 0) {
      // 通过参数控制递归深度
      var flattenedSubArray = flattenArray(arr[i], depth - 1);
      // apply 方法允许我们指定函数的 this 值和参数列表
      Array.prototype.push.apply(result, flattenedSubArray);
    } else {
      result.push(arr[i]);
    }
  }

  return result;
}

// 测试
const nestedArray = [1, [2, [3, [4]], 5]];
console.log(flattenArray(nestedArray)); // [1, 2, 3, 4, 5]（完全扁平化）
console.log(flattenArray(nestedArray, 2)); // [1, 2, 3, [4], 5]（深度为2）
console.log(flattenArray(nestedArray, 0)); // [1, [2, [3, [4]], 5]]（深度为0，不扁平化）
