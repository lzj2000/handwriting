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