// 定义全局函数
const IG = {
  isLogin: function() {
    let result = false
    if (window.localStorage.getItem("token") == null || window.store.getters.token == null) {
      result = false
    } else {
      result = true
    }
    return result
  },
  test: function() {
    console.log("test")
  },
  // 常用正则库
  REG: {
    // 5-20位以字母开头，字母，数字，减号，下划线
    USERNAME:	/^[a-zA-Z]([-_a-zA-Z0-9]{4,19})+$/,
    PASS: /^[a-zA-Z0-9_-]{6,20}$/,
    EMAIL: /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/,
    URL:	/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    IP:	/((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/,
    HTML:	/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/,
    // 手机号
    PHONE: /^(13|14|15|17|18|19)[0-9]{9}$/,
    // 汉字
    CHINESE: /^[\u2E80-\u9FFF]+$/,
    // 验证码 6位纯数字
    VALCODE: /\d{6}/
  },

  // 常量库
  TypeMap: {
    AI: 'telemeter',
    DI: 'telesignal',
    AO: 'teleadjust',
    DO: 'telecontrol',
    CF: 'teleconfig'
  },

  // UA
  BROWSER: (function() {
    const ua = navigator.userAgent.toLowerCase()
    return {
      IE: ((ua.indexOf("msie") > -1 || "ActiveXObject" in window) && ua.indexOf("opera") == -1),
      IE9: (ua.indexOf("msie 9.0") > -1),
      IE10: (ua.indexOf("msie 10.0") > -1),
      IE11: (ua.indexOf("trident") > -1 && ua.indexOf("rv") > -1),
      EDGE: (ua.indexOf("edge") > -1),
      GECKO: (ua.indexOf("gecko") > -1 && ua.indexOf("khtml") == -1),
      WEBKIT: (ua.indexOf("applewebkit") > -1),
      OPERA: (ua.indexOf("opera") > -1),
      CHROME: (ua.indexOf("chrome") > -1)
    }
  })()
}
// 关联到window对象上 方便使用
window.IG = IG
export default IG
