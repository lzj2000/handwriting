/**
 * 需求理解
 *
 * 一、目标
 * 使用Generator函数模拟async/await的实现原理

 * 二、功能要求
 *  - 接收Generator函数作为参数；
 *  - 使用Iterator迭代器逐步执行；
 *  - 处理Promise的异步流程；
 *  - 自动处理yield的返回值。
 * 

 * 三、实现步骤
 *  1. Generator执行：创建generator对象并逐步执行。
 *  2. Promise包装：将yielded值包装成Promise。
 *  3. 自动迭代：自动调用next()和throw()方法。
 *  4. 错误处理：捕获异常并传递给generator。

 * 四、关键点说明
 *  - Generator函数可以暂停和恢复执行。
 *  - Promise.resolve确保所有值都是Promise。
 *  - 自动执行器负责驱动Generator运行完成。
 *  - 正确处理异常和错误传播机制。
 */

/**
 * 将Generator函数转换为async函数
 * @param {GeneratorFunction} generatorFn - 需要转换的Generator函数
 * @returns {Function} - 返回一个返回Promise的async函数
 */
function generatorToAsync(generatorFn) {
  return function (...args) {
    const iterator = generatorFn.apply(this, args);
    return new Promise((resolve, reject) => {
      function next(data) {
        try {
          const { value, done } = iterator.next(data);
          if (done) {
            resolve(value);
          } else {
            Promise.resolve(value)
              .then(
                (data) => next(data),
                (err) => iterator.throw(err)
              )
          }
        } catch (error) {
          reject(error);
        }
      }
      next();
    });
  };
}

//测试
// 测试用例1：基本异步流程
function* basicAsyncFlow() {
  const result1 = yield Promise.resolve(1);
  const result2 = yield Promise.resolve(result1 + 2);
  return result2;
}

generatorToAsync(basicAsyncFlow)().then((res) => {
  console.log("测试1 (基本异步流程) 结果:", res); // 预期输出: 3
});

// 测试用例2：同步值处理
function* syncValues() {
  const a = yield 10;
  const b = yield a + 5;
  return b;
}

generatorToAsync(syncValues)().then((res) => {
  console.log("测试2 (同步值处理) 结果:", res); // 预期输出: 15
});

// 测试用例3：多个yield串联
function* multipleYields() {
  const step1 = yield new Promise((resolve) =>
    setTimeout(() => resolve(2), 100)
  );
  const step2 = yield step1 * 3;
  const step3 = yield new Promise((resolve) =>
    setTimeout(() => resolve(step2 + 4), 50)
  );
  return step3;
}

generatorToAsync(multipleYields)().then((res) => {
  console.log("测试3 (多个yield串联) 结果:", res); // 预期输出: 10
});
