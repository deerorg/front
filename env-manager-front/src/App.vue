<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// Import the EventBus we just created.
import { mapGetters } from 'vuex'
import { checkUserIsOnline } from '@/api/login'
// import Config from '@/config';
export default {
  name: "app",
  mounted() {
    // this.$bus.$on('my-event', ($event) => {
    //     console.log('My event has been triggered', $event)
    // });
    // this.t();

    const me = this
    console.log("CKplayer", window.CKobject)
    // 判断是否登录
    me.checkUserOnline()
    if (me.token && localStorage.token) {
      return
    } else {
      localStorage.removeItem("token")
      localStorage.clear()
      me.$router.push('/login')
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  updated() {},
  methods: {
    // 加载播放器js
    // loadJS(){
    //         var head= document.getElementsByTagName('head')[0];
    //         var script= document.createElement('script');
    //         script.type= 'text/javascript';
    //         script.src= Config.IOT_PLAYER_URL_PRE + 'ckplayer.js';
    //         head.appendChild(script);
    //   },
    checkUserOnline() {
      const me = this
      window.intervalFlag = setInterval(function() {
        // if(localStorage.token && localStorage.token.length > 10)
        const isInLoginView = window.location.href.match("/login")
        console.log("----", isInLoginView)
        if (isInLoginView && isInLoginView.length == 1) {
          return
        } else {
          checkUserIsOnline().then(resp => {
            // console.log(resp);
            if (resp.status == 200 && resp.data == null) {
              // console.log("正常在线");
            } else if (resp.status == 200 && resp.data == 'REPEAT_LOGIN') {
              localStorage.clear()
              window.router.push('/login')
            }
          })
        }
      }, 10000)
    }
  }
}
</script>

<style lang="scss">
@import "~normalize.css/normalize.css"; // normalize.css 样式格式化
@import "./styles/index.scss"; // 全局自定义的css样式
html,
body,
#app {
  height: 100%;
  width: 100%;
  background: url(./assets/img/ic_setting_bg.png);
  color: white;
}
</style>
