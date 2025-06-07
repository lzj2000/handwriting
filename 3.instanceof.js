/** 手动实现instanceof机制 */
function myInstanceof(obj, constructorFn) {
    // 类型检查
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    // 获取构造函数的原型
    const prototype = constructorFn.prototype;

    // 原型链遍历
    let currentProto = Object.getPrototypeOf(obj)
    while (currentProto !== null) {
        // 终止条件
        if (currentProto === prototype) {
            return true;
        }
        currentProto = Object.getPrototypeOf(currentProto);
    }

    return false
}