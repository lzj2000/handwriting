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
class Subject {
  constructor() {
    this.observers = [];
    this.state = null;
  }

  // 添加观察者
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  // 移除观察者
  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  // 通知所有观察者
  notify(data) {
    this.observers.forEach((observer) => observer.update(data));
  }

  setState(newState) {
    this.state = newState;
    this.notify(newState);
  }

  getState() {
    return this.state;
  }
}

// 观察者（Observer）类
class Observer {
  constructor(name) {
    this.name = name;
  }

  // 更新方法，当被观察者状态改变时调用
  update(data) {
    console.log(`${this.name} 收到通知:${data}`);
  }
}

// 使用示例
// 学生状态变化通知家长和老师
// 支持多个观察者
// 状态变化的自动通知机制

const subject = new Subject();

const observer1 = new Observer("家长");
const observer2 = new Observer("老师");

// 添加观察者
subject.addObserver(observer1);
subject.addObserver(observer2);

// 通知观察者
subject.setState("正常");

// 移除观察者
subject.removeObserver(observer1);

// 再次通知，只有 observer2 会收到
subject.setState("不正常");
