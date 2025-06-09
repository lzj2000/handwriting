/**
 * 需求理解
 *
 * 一、目标
 * 实现函数防抖，在频繁触发中只执行最后一次

 * 二、功能要求
 *  - 设置延迟时间参数；
 *  - 每次调用都重新计时；
 *  - 支持立即执行模式；
 *  - 返回可取消的函数。

 * 三、实现步骤
 *  1. 闭包保存状态：通过闭包持久化 timer 变量，记录定时器状态。
 *  2. 清除旧定时器：每次触发时先清除之前的定时器，确保重新计时。
 *  3. 正确绑定上下文：使用 fn.apply(context, args) 保留原函数的 this 指向和参数。

 * 四、关键点说明
 *  - 使用闭包保存定时器状态，实现状态持久化。
 *  - 每次调用都要清除之前的定时器，重新计时。
 *  - 正确处理this指向，使用apply绑定上下文。
 *  - 支持immediate模式，第一次触发立即执行。
 */

/**
 * 手动实现防抖函数
 * 防抖函数用于限制函数的执行频率，当频繁触发某个函数时，只有在最后一次触发后的一段时间内没有再次触发，才会执行该函数
 * 这在处理一些高频触发的事件（如窗口调整、滚动、键盘输入等）时非常有用，可以避免函数被过度频繁地调用，从而提升性能
 *
 * @param {Function} fn 要被防抖处理的函数
 * @param {number} delay 延迟执行的时间，单位为毫秒
 * @param {boolean} immediate 是否在第一次触发时立即执行函数，默认为false
 * @returns {Function} 返回一个防抖处理后的函数
 */
function debounce(fn, delay, immediate = false) {
  let timer = null;
  // 使用闭包保存定时器状态
  return function (...args) {
    const context = this;

    // 每次调用都要清除之前的定时器，重新计时
    if (timer) clearTimeout(timer);

    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);

      // 如果当前是第一次触发或者上一次触发后已经超过了延时时间，则立即执行函数
      if (callNow) {
        fn.apply(context, args);
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    }
  };
}

// 测试
function testDebounce() {
  console.log("=== 开始防抖测试 ===");

  // 1. 基础功能测试
  let count = 0;
  const basicFn = debounce(() => {
    count++;
    console.log("基础测试执行，当前count:", count);
  }, 300);

  console.log("-- 测试连续触发3次 --");
  basicFn();
  basicFn();
  basicFn();
  setTimeout(() => {
    console.log("300ms后结果:", count === 1 ? "✓ 通过" : "✗ 失败");
  }, 300);

  // 2. 立即执行测试
  let immediateCount = 0;
  const immediateFn = debounce(
    () => {
      immediateCount++;
      console.log("立即执行测试，当前count:", immediateCount);
    },
    300,
    true
  );

  console.log("\n-- 测试立即执行模式 --");
  immediateFn();
  console.log("首次调用后count:", immediateCount === 1 ? "✓ 通过" : "✗ 失败");
  immediateFn();
  setTimeout(() => {
    console.log("300ms后count:", immediateCount === 1 ? "✓ 通过" : "✗ 失败");
  }, 300);

  // 3. 手动测试this绑定
  console.log("\n-- 手动验证this绑定 --");
  const obj = {
    name: "test",
    showName: debounce(function () {
      console.log("this.name:", this.name === "test" ? "✓ 通过" : "✗ 失败");
    }, 100),
  };
  obj.showName();
}
// 运行测试
testDebounce();
