/**
 * 需求理解
 *
 * 一、目标
 * 使用ES6新特性实现数组扁平化

 * 二、功能要求
 *  - 使用扩展运算符和concat方法；
 *  - 利用some方法检测嵌套数组；
 *  - 递归调用直到完全扁平化；
 *  - 代码简洁易读。
 * 
 * 三、三种实现方式
 * 1. reduce版本：函数式编程风格，支持深度控制
 * 2. spread版本：利用扩展运算符，简洁但只能完全扁平化
 * 3. 迭代版本：避免递归栈溢出，适合深层嵌套
 * 
 * 四、关键点说明
 *  - 利用ES6的reduce方法和箭头函数。
 *  - 扩展运算符可以简化数组展开操作。
 *  - some方法可以检测数组中是否还有嵌套数组。
 *  - 迭代方式避免递归调用栈的限制。

 */

/**
 * 递归地扁平化嵌套数组（使用扩展运算符实现）
 *
 * @param {Array} arr - 需要扁平化的嵌套数组（可以包含任意深度的子数组）
 * @returns {Array} - 扁平化后的一维数组
 */
const flattenWithSpread = (arr) => {
    while (arr.some((item) => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
};

/**
 * 使用reduce方法递归地扁平化数组
 * @param {Array} arr - 需要扁平化的多维数组
 * @param {number} [depth=1] - 扁平化的深度层级，默认为1（浅扁平化）
 * @returns {Array} - 返回扁平化后的新数组，原数组不会被修改
 */
const flattenWithReduce = (arr, depth = 1) => {
    if (depth <= 0) return arr.slice();
    return arr.reduce(
        (acc, cur) =>
            acc.concat(Array.isArray(cur) ? flattenWithReduce(cur, depth - 1) : cur),
        []
    );
};

/**
 * 将嵌套数组扁平化为一维数组（迭代实现）
 * @param {Array} arr - 需要扁平化的嵌套数组
 * @returns {Array} - 扁平化后的一维数组
 */
function flattenIteratively(arr) {
    const stack = [...arr]; //保证不会破坏原数组
    const result = [];
    while (stack.length) {
        const first = stack.shift();
        if (Array.isArray(first)) {
            stack.unshift(...first);
        } else {
            result.push(first);
        }
    }
    return result;
}

// 测试
// 测试用例
const testArray = [1, [2, [3, [4]]], 5];

// 测试flattenWithSpread
console.log("flattenWithSpread:", flattenWithSpread(testArray));
// 应输出: [1, 2, 3, 4, 5]

// 测试flattenWithReduce (深度1)
console.log("flattenWithReduce (depth=1):", flattenWithReduce(testArray));
// 应输出: [1, 2, [3, [4]], 5]

// 测试flattenWithReduce (深度无限)
console.log(
    "flattenWithReduce (depth=Infinity):",
    flattenWithReduce(testArray, Infinity)
);
// 应输出: [1, 2, 3, 4, 5]

// 测试flattenIteratively
console.log("flattenIteratively:", flattenIteratively(testArray));
// 应输出: [1, 2, 3, 4, 5]

// 边界测试
console.log("空数组测试:", flattenWithSpread([])); // 应输出: []
console.log("非数组测试:", flattenWithSpread([1, 2, 3])); // 应输出: [1, 2, 3]

/** -----------------性能测试--------------- */
// 测试数据生成函数
function generateTestData(depth, itemsPerLevel) {
    let arr = [];
    for (let i = 0; i < itemsPerLevel; i++) {
        arr.push(i);
    }

    for (let d = 0; d < depth; d++) {
        let newArr = [];
        for (let i = 0; i < itemsPerLevel; i++) {
            newArr.push([...arr]);
        }
        arr = newArr;
    }

    return arr;
}

// 测试用例
const shallowArray = [1, [2, 3], [4, [5, 6]]];
const mediumArray = generateTestData(3, 5); // 3层深度，每层5个元素
const deepArray = generateTestData(10, 2); // 10层深度，每层2个元素

// 性能测试函数
function runPerformanceTest(name, fn, testData) {
    console.log(`开始测试: ${name}`);

    // 预热
    for (let i = 0; i < 5; i++) {
        fn(testData);
    }

    // 正式测试
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
        fn(testData);
    }
    const end = performance.now();

    console.log(`结果: ${(end - start).toFixed(4)}ms`);
    console.log('----------------------------------');
}

// 运行测试
console.log('=== 浅层数组测试 ===');
runPerformanceTest('spread 方法', flattenWithSpread, shallowArray);// 4.3889ms
runPerformanceTest('reduce 方法', arr => flattenWithReduce(arr, Infinity), shallowArray); // 9.7202ms
runPerformanceTest('迭代 方法', flattenIteratively, shallowArray);// 3.3555ms

console.log('=== 中等深度数组测试 ===');
runPerformanceTest('spread 方法', flattenWithSpread, mediumArray);// 21.3332ms
runPerformanceTest('reduce 方法', arr => flattenWithReduce(arr, Infinity), mediumArray);// 400.7832ms
runPerformanceTest('迭代 方法', flattenIteratively, mediumArray);// 33.0845ms

console.log('=== 深层数组测试 ===');
runPerformanceTest('spread 方法', flattenWithSpread, deepArray);// 183.0423ms
runPerformanceTest('reduce 方法', arr => flattenWithReduce(arr, Infinity), deepArray); // 1595.8762ms
runPerformanceTest('迭代 方法', flattenIteratively, deepArray); //  256.1655ms

// 扩展
// 现代浏览器已原生支持数组扁平化方法，可以作为备选方案：
// 原生flat方法 (ES2019)
const nativeFlatten = (arr, depth = Infinity) => arr.flat(depth);
// 测试
console.log("原生flat方法:", nativeFlatten(testArray)); // [1, 2, 3, 4, 5]