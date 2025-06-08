
/**
 * 手动实现防抖函数
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
    // 待执行的参数
    let pendingArgs = null;

    const execute = (args) => {
        fn.apply(this, args);
        lastExecTime = Date.now();
        timer = null;
        pendingArgs = null;
    };

    return function (...args) {
        const now = Date.now();
        const elapsed = now - lastExecTime;

        // 清除已有的定时器
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        // 首次执行(leading为true时)
        if (leading && lastExecTime === 0) {
            execute(args);
            return;
        }

        // 达到延迟时间，立即执行
        if (elapsed >= delay) {
            execute(args);
        }
        // 未达到延迟时间且需要尾部执行
        else if (trailing) {
            pendingArgs = args;
            timer = setTimeout(() => execute(pendingArgs), delay - elapsed);
        }
    };
}