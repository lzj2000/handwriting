/**
 *
 * 需求理解
 *
 * 一、目标
 * 实现任务队列机制，模拟浏览器的事件循环

 * 二、功能要求
 *  - 实现微任务队列和宏任务队列
 *  - 按照浏览器事件循环的规则执行任务
 *
 * 三、实现步骤
 *  1. 执行主任务，同时注册和管理微任务与宏任务队列。
 *  2. 主任务执行完成后，判断是否有微任务，有则执行，直至微任务队列为空。
 *  3. 从宏任务队列中取出并执行一个任务，执行完毕后立即清空微任务队列，然后再处理下一个宏任务。循环此过程直至所有队列为空。
 *
 * 四、关键点说明
 *  - 微任务优先级高于宏任务
 *  - 微任务队列需要一次性清空
 *  - 每次只执行一个宏任务
 *  - 执行宏任务后需要再次检查微任务队列
 */

// 宏任务队列
const macroTasks = [];
// 微任务队列
const microTasks = [];

const pushMicro = (fn) => {
  microTasks.push(fn);
};

const pushMacro = (fn) => {
  macroTasks.push(fn);
};

startEventLoop = () => {
  // 先清空微任务队列
  while (microTasks.length) {
    microTasks.shift()();
  }

  // 如果有宏任务，执行一个宏任务
  if (macroTasks.length) {
    macroTasks.shift()();

    startEventLoop();
  }
};
/**
 * 测试函数
 */
const run = () => {
  console.log("a");

  pushMicro(() => {
    console.log("b");
    pushMicro(() => {
      console.log("c");
    });
    pushMacro(() => {
      console.log("d");
    });
  });

  pushMacro(() => {
    console.log("e");
  });

  console.log("f");

  startEventLoop();
};

// 执行测试
run();
// 输出：a, f, b, c, e, d
