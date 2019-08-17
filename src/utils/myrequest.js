// 封装一个 wx.request使用 promise
function myRequest(options) {
  // 判断是否存在  baseUrl
  options.baseUrl = options.baseUrl || "https://autumnfish.cn/wx/";
  return new Promise((resolve, reject) => {
    // 发送请求
    wx.request({
      url: options.baseUrl + options.url, // 请求的路径
      method: options.method || "GET", // 请求方式 （规范： GET POST）
      data: options.data || {}, // 请求的参数
      header: options.header || {}, // 请求头部
      success: function(res) {
        // 成功后的回调函数
        resolve(res);
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

// 暴露方法
export default myRequest;