import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入animate.css
import animate from 'animate.css'
import App from './App'
import router from './router'
import store from './store'

import * as filters from './filters'
import './directives'

// 引入字体
import './assets/iconfont/iconfont'

// 引入svg组件
import IconSvg from '@/components/Icon-svg'

// 全局注册icon-svg
Vue.component('icon-svg', IconSvg)

// import '@/icons' // icon
// import '@/permission' // 权限
import errLog from '@/errLog' // error

import IG from './global'

// 引入event-bus
import './event-bus'

Vue.use(ElementUI)
// 阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

// vue开者工具
Vue.config.devtools = true

// 轮询用户在线
// import './checkUserIsOnline';

// 全局注册filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 方便调试
window.router = router

// 生产环境错误日志
if (process.env === 'production') {
  Vue.config.errorHandler = function(err, vm) {
    console.log(err, window.location.href)
    errLog.pushLog({
      err,
      url: window.location.href,
      vm
    })
  }
}

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
