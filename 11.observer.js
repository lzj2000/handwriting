/**
 *
 * 需求理解
 *
 * 一、目标
 * 实现观察者模式，包含观察者和被观察者

 * 二、功能要求
 *  - 被观察者维护观察者列表；
 *  - 状态变化时通知所有观察者；
 *  - 观察者实现update方法；
 *  - 支持观察者的添加和移除。
 * 

 * 三、实现步骤
 *  1. 被观察者（Subject）： 维护观察者列表，提供添加、移除和通知方法。
 *  2. 观察者（Observer）： 实现update方法，接收被观察者的状态变化通知。
 *  3. 状态管理： 被观察者内部维护状态，状态改变时自动通知所有观察者。
 *  4. 通知机制： 遍历观察者列表，调用每个观察者的update方法。
 *  5. 解耦设计： 观察者和被观察者通过接口交互，降低耦合度。

 * 四、关键点说明
 *  - 需要在被观察者中维护观察者列表数组。
 *  - 需要在状态改变时遍历通知所有观察者。
 *  - 需要为观察者定义统一的update接口方法。
 *  - 需要提供添加和移除观察者的方法。
 */
/**
 * Subject类 - 被观察者
 * @class
 * @description 维护观察者列表,管理状态变化并通知观察者
 */
class Subject {
  /**
   * @constructor
   * @description 初始化观察者列表和状态
   */
  constructor() {
    this.observers = []; // 观察者列表
  }

  /**
   * 添加观察者到列表
   * @param {Observer} observer - 要添加的观察者对象
   * @description 如果观察者不存在则添加到列表中
   */
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  /**
   * 从列表中移除观察者
   * @param {Observer} observer - 要移除的观察者对象
   * @description 通过过滤方式移除指定观察者
   */
  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  /**
   * 通知所有观察者
   * @description 遍历观察者列表并调用每个观察者的update方法
   */
  notify() {
    this.observers.forEach((observer) => observer.update(this));
  }
}

/**
 * Observer类 - 观察者
 * @class
 * @description 实现观察者模式中的观察者角色
 */
class Observer {
  constructor() {}
  /**
   * 更新方法
   * @param {any} data - 接收到的数据
   * @description 当被观察者状态改变时被调用
   */
  update(data) {
    console.log(`收到通知`, data);
  }
}

// 使用示例
// 学生状态变化通知家长和老师
// 支持多个观察者
// 状态变化的自动通知机制

class StudentSubject extends Subject {
  constructor(name) {
    super();
    // 初始化学生状态
    this.state = null;
    this.name = name;
    this.observers = [];
  }

  // 该方法用于获取当前的学生状态
  getState() {
    return this.state;
  }

  // 该方法用于改变学生状态
  setState(state) {
    // prd的值发生改变
    this.state = state;
    // 需求文档变更，立刻通知所有开发者
    this.notify();
  }
}

class StudentObserver extends Observer {
  constructor(name) {
    super();
    this.state = {};
    this.name = name;
  }

  // 重写一个具体的update方法
  update(content) {
    const state = content.getState();
    const studentName = content.name;
    const name = this.name;
    console.log(`${name}收到通知：${studentName}的状态更新为${state}`);
  }
}

const subject = new StudentSubject("小明");

const observer1 = new StudentObserver("家长");
const observer2 = new StudentObserver("老师");

// 添加观察者
subject.addObserver(observer1);
subject.addObserver(observer2);

// 通知观察者
subject.setState("正常");

// 移除观察者
subject.removeObserver(observer1);

// 再次通知，只有 observer2 会收到
subject.setState("不正常");
