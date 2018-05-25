// 配置全局常用的常量

//const BASE = 'http://192.168.37.16:8089/'
const BASE = 'http://39.108.55.120:8089/'
// const BASE = 'http://127.0.0.1:8089/'
const baseConfig = {
  // api 数据请求接口 基本路径
  TIMEOUT: 1000000000,
  // build 生产地址
  BASE_API: 'http://39.108.55.120:8089/api/',
  //BASE_API: BASE + 'api/',
  //BASE_API: 'http://192.168.33.79:8089/api/',
  //
  // BASE_API: 'http://localhost:8089/api/',

  // 31.9 https
  // 文件上传地址
  FILE_UPLOAD_URL: BASE + '/api/files/devicefileupload',

  // 播放器地址
  IOT_PLAYER_URL_PRE: BASE + '/iot/ckplayer/',

  // ipc 全局配置
  IPC: {
    // 是否开启自动播放
    AUTOPLAY: 1,
    // 正常连接封面
    NORMAL_URL: `${BASE}iot/static/ipc_normal.jpg`,
    // 异常连封面
    ERROR_URL: `${BASE}iot/static/ipc_error.jpg`,
    // 默认播放视频地址 mp4 或 视频流
    // DEFAULT_URL: `${BASE}iot/static/ipc_error_infore.mp4`
    DEFAULT_URL: 'http://img.ksbbs.com/asset/Mon_1703/05cacb4e02f9d9e.mp4'
  },

  MOCK_BASE_API: 'https://infore.com/api',
  // BASE_API: 'http://192.168.31.163/api/',
  // 网站源地址
  // 标识是开发模式
  VERSION: 'V1.0',
  // 版本日期
  VERSIONDATE: '2018-01-24'
  // 主题背景配置

}

export default baseConfig
