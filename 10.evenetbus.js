/**
 *
 * 需求理解
 *
 * 一、目标
 * 实现发布订阅模式的事件系统

 * 二、功能要求
 *  - 支持事件的注册（on）和发布（emit）；
 *  - 支持一次性事件监听（once）；
 *  - 支持事件的移除（off）；
 *  - 事件发布时触发所有对应的监听器。
 * 

 * 三、实现步骤
 *  1. events 对象：使用一个对象来存储事件和监听器。
 *  2. on 方法：用于注册事件监听器。
 *  3. emit 方法：用于触发事件，执行所有监听器。
 *  4. off 方法：用于移除事件监听器。
 *  5. once 方法：用于注册只执行一次的监听器。

 * 四、关键点说明
 *  - 需要使用一个对象来存储事件和监听器。
 *  - on 方法用于注册事件监听器。
 *  - emit 方法用于触发事件，执行所有监听器。
 *  - off 方法用于移除事件监听器。
 *  - once 方法用于注册只执行一次的监听器。
 */

/**
 * 事件总线类 - 实现发布订阅模式
 * 用于组件/模块间的解耦通信
 */
class EventBus {
  constructor() {
    /**
     * 存储所有事件及其监听器
     * @type {Object<string, Set<Function>>}
     * @private
     */
    this.events = {};
  }

  /**
   * 注册事件监听器
   * @param {string} type - 事件类型/名称
   * @param {Function} fn - 事件处理函数/监听器
   * @returns {eventBus} - 返回实例本身，支持链式调用
   */
  on(type, fn) {
    if (!this.events[type]) {
      this.events[type] = new Set();
    }
    this.events[type].add(fn);
    return this;
  }

  /**
   * 触发指定类型的事件
   * @param {string} type - 事件类型/名称
   * @param {...any} args - 传递给事件处理函数的参数
   * @returns {eventBus} - 返回实例本身，支持链式调用
   */
  emit(type, ...args) {
    this.events[type]?.forEach((fn) => fn(...args));
    return this;
  }

  /**
   * 移除事件监听器
   * @param {string} type - 事件类型/名称
   * @param {Function} fn - 要移除的事件处理函数/监听器
   * @returns {eventBus} - 返回实例本身，支持链式调用
   */
  off(type, fn) {
    this.events[type]?.delete(fn);
    return this;
  }

  /**
   * 注册只执行一次的事件监听器
   * @param {string} type - 事件类型/名称
   * @param {Function} fn - 事件处理函数/监听器
   * @returns {eventBus} - 返回实例本身，支持链式调用
   */
  once(type, fn) {
    const onceFn = (...args) => {
      fn(...args);
      this.off(type, onceFn);
    };
    this.on(type, onceFn);
    return this;
  }
}

// 创建测试函数
function testEventBus() {
  // 创建eventBus实例
  const bus = new eventBus();
  console.log('创建eventBus实例成功');
  
  // 测试on和emit方法
  console.log('\n----- 测试 on 和 emit 方法 -----');
  let count = 0;
  const handler1 = (data) => {
    count++;
    console.log(`事件处理函数1被调用，接收到的数据: ${JSON.stringify(data)}`);
  };
  
  bus.on('increment', handler1);
  console.log('注册事件「increment」的监听器');
  
  bus.emit('increment', { value: 10 });
  console.log(`事件触发后count值: ${count}`);
  
  // 测试多次触发
  bus.emit('increment', { value: 20 });
  bus.emit('increment', { value: 30 });
  console.log(`多次触发后count值: ${count}`);
  
  // 测试多个监听器
  console.log('\n----- 测试多个监听器 -----');
  const handler2 = (data) => {
    console.log(`事件处理函数2被调用，接收到的数据: ${JSON.stringify(data)}`);
  };
  
  bus.on('increment', handler2);
  console.log('为同一事件「increment」注册第二个监听器');
  
  bus.emit('increment', { value: 40 });
  console.log('触发事件，两个监听器都应该被调用');
  
  // 测试off方法
  console.log('\n----- 测试 off 方法 -----');
  bus.off('increment', handler1);
  console.log('移除事件「increment」的第一个监听器');
  
  bus.emit('increment', { value: 50 });
  console.log('触发事件，只有第二个监听器应该被调用');
  
  // 测试once方法
  console.log('\n----- 测试 once 方法 -----');
  let onceCount = 0;
  const onceHandler = (data) => {
    onceCount++;
    console.log(`一次性事件处理函数被调用，接收到的数据: ${JSON.stringify(data)}`);
  };
  
  bus.once('onceEvent', onceHandler);
  console.log('注册一次性事件「onceEvent」的监听器');
  
  bus.emit('onceEvent', { message: '这是第一次调用' });
  console.log(`一次性事件第一次触发后onceCount值: ${onceCount}`);
  
  bus.emit('onceEvent', { message: '这是第二次调用' });
  console.log(`一次性事件第二次触发后onceCount值: ${onceCount}，应该仍为1`);
  
  console.log('\n===== eventBus 测试完成 =====');
}

// 运行测试
testEventBus();