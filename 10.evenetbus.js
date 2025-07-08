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
class eventBus {
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
