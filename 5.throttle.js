/**
 * 需求理解
 *
 * 一、目标
 * 实现函数节流，在频繁触发中按固定频率执行

 * 二、功能要求
 *  - 设置时间间隔参数；
 *  - 在时间间隔内只执行一次；
 *  - 支持首次立即执行；
 *  - 支持尾部执行模式。

 * 三、实现步骤
 *  1. 时间控制：记录上次执行时间，控制执行频率。
 *  2. leading模式：第一次触发立即执行。
 *  3. trailing模式：时间间隔结束后执行最后一次调用。
 *  4. 参数保存：保存最新的参数和上下文用于trailing执行。

 * 四、关键点说明
 *  - 通过时间戳控制函数执行频率。
 *  - 支持leading和trailing两种执行模式。
 *  - 保存最新参数用于延迟执行。
 *  - 使用定时器确保trailing执行。
 */

/**
 * 手动实现节流函数
 *
 * @param {Function} fn 要节流的函数。
 * @param {number} delay 延迟的毫秒数。
 * @param {boolean} [leading=true] 是否在第一次调用时立即执行函数。
 * @param {boolean} [trailing=false] 是否在最后一次调用后执行函数。
 * @returns {Function} 返回一个新的节流函数。
 */
function throttle(fn, delay, leading = true, trailing = false) {
  // 上次执行的时间戳
  let lastExecTime = 0;
  // 定时器变量
  let timer = null;

  return function (...args) {
    const now = Date.now();
    const context = this;
    // 如果是第一次调用且不需要立即执行
    if (!leading && lastExecTime === 0) {
      lastExecTime = now;
    }
    const elapsed = now - lastExecTime;
    if (elapsed >= delay) {
      if (timer) {
        clearTimeout(timer);
      }
      fn.apply(context, args);
      lastExecTime = now;
    } else if (trailing && !timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        // 如果leading为false，重置为0，这样下次调用会被视为首次调用
        lastExecTime = leading ? Date.now() : 0;
        timer = null;
      }, delay - elapsed);
    }
  };
}

// 测试
function testThrottle() {
  console.log("=== 开始节流测试 ===");

  // 1. 基础节流测试（leading模式）
  let count1 = 0;
  const basicFn = throttle(() => {
    count1++;
    console.log(`基础节流执行 (${count1})`, new Date().getSeconds());
  }, 1000);

  console.log("-- 测试leading模式(1秒间隔) --");
  const interval1 = setInterval(() => {
    basicFn();
    if (count1 >= 3) clearInterval(interval1);
  }, 200);

  // 2. trailing模式测试
  setTimeout(() => {
    let count2 = 0;
    const trailingFn = throttle(
      () => {
        count2++;
        console.log(`trailing模式执行 (${count2})`, new Date().getSeconds());
      },
      1000,
      false
    );

    console.log("\n-- 测试trailing模式(1秒间隔) --");
    const interval2 = setInterval(() => {
      trailingFn();
      if (count2 >= 3) clearInterval(interval2);
    }, 200);
  }, 4000);

  // 3. 混合模式测试
  setTimeout(() => {
    let count3 = 0;
    const mixFn = throttle(
      () => {
        count3++;
        console.log(`混合模式执行 (${count3})`, new Date().getSeconds());
      },
      1000,
      true,
      true
    );

    console.log("\n-- 测试leading+trailing混合模式 --");
    const interval3 = setInterval(() => {
      mixFn();
      if (count3 >= 3) clearInterval(interval3);
    }, 200);
  }, 8000);
}

// 执行测试
testThrottle();
