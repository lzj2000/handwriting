/**
 *
 * 需求理解
 *
 * 一、目标
 * 将传统的Ajax请求封装为Promise形式

 * 二、功能要求
 *  - 返回Promise实例；
 *  - 创建XMLHttpRequest对象；
 *  - 处理请求的各种状态；
 *  - 支持GET、POST等HTTP方法。
 * 

 * 三、实现步骤
 *  1. 状态检查：readyState === 4 表示请求完成。
 *  2. 状态码判断：2xx表示成功，其他表示失败。
 *  3. 自动迭代：自动调用next()和throw()方法。
 *  4. 错误处理：捕获异常并传递给generator。

 * 四、关键点说明
 *  - Generator函数可以暂停和恢复执行。
 *  - Promise.resolve确保所有值都是Promise。
 *  - 自动执行器负责驱动Generator运行完成。
 *  - 正确处理异常和错误传播机制。
 */

/**
 * 将传统的Ajax请求封装为Promise形式
 *
 * @param {string} url - 请求URL
 * @param {string} method - 请求方法，默认为GET
 * @param {Object|null} data - 请求数据，对象会被自动序列化为JSON
 * @param {Object} options - 配置选项
 * @param {number} [options.timeout=10000] - 请求超时时间(毫秒)
 * @param {string} [options.responseType=''] - 响应类型
 * @returns {Promise<any>} 返回Promise，成功时解析为响应数据（自动反序列化），失败时拒绝并提供错误信息
 */
function ajaxPromise(url, method = "GET", data = null, options = {}) {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      timeout: 10000,
      responseType: "",
    };
    const mergedOptions = { ...defaultOptions, ...options };

    const xhr = new XMLHttpRequest();
    xhr.timeout = mergedOptions.timeout;
    xhr.open(method, url, true);
    if (mergedOptions.responseType) {
      xhr.responseType = mergedOptions.responseType;
    }

    // 处理请求数据
    let processedData = data;
    if (
      data &&
      typeof data === "object" &&
      !(data instanceof FormData) &&
      !(data instanceof Blob) &&
      !(data instanceof ArrayBuffer)
    ) {
      processedData = JSON.stringify(data);
    }

    // 处理加载完成事件
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        // 确保请求完成
        if (xhr.status >= 200 && xhr.status < 300) {
          let response = xhr.response;
          // 如果响应类型未设置，尝试解析JSON
          if (xhr.responseType === "" || xhr.responseType === "text") {
            if (response) {
              try {
                response = JSON.parse(response);
              } catch (e) {
                console.warn("JSON解析失败，返回原始响应:", e);
              }
            }
          }

          resolve(response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.response,
          });
        }
      }
    };

    // 处理网络错误
    xhr.onerror = function () {
      reject({
        status: 0,
        statusText: "网络错误",
        error: new Error("网络请求失败"),
      });
    };

    // 处理超时
    xhr.ontimeout = function () {
      reject({
        status: 0,
        statusText: "请求超时",
        error: new Error("请求超时"),
      });
    };

    // 发送请求
    xhr.send(processedData);
  });
}
