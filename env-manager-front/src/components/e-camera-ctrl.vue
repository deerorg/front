<template>
  <div class="ecameractrl">
    <section class="ecameractrl__tool">
      <span class="ecameractrl__item" @click="goView(1)" title="一画面"><icon-svg icon-class="icon--" size="30px"></icon-svg></span>
      <span class="ecameractrl__item" @click="goView(4)" title="四画面"><icon-svg icon-class="jiugongge" size="30px"></icon-svg></span>
      <span class="ecameractrl__item" @click="goView(9)" title="九画面"><icon-svg icon-class="jiugongge1" size="30px"></icon-svg></span>
      <span class="ecameractrl__item"  v-show="isShowFullScreen" style="float:right" @click="fullscreen" :title="fullscreenText"><icon-svg icon-class="full-screen" size="30px"></icon-svg></span>
       <!-- v-show="fullscreenText == '返回'" -->
      <span class="ecameractrl__item" v-show="fullscreenText == '返回'" style="float:right" @click="maxView" :title="maxViewText"><icon-svg icon-class="device--pc" size="30px"></icon-svg></span>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ecameractrl',
  data() {
    return {
      fullscreenText:'全屏',
      maxViewText: '最大化',
      type:'',
      isShowFullScreen: true,
    }
  },
  methods: {
    goView(type){
      let me = this
      me.type = type
      if(type==1){
        me.$router.push('/monitoring/one')
      }else if(type== 4){
        me.$router.push('/monitoring/four')
      }else if(type== 9){
        me.$router.push('/monitoring/nine')
      }
    },
    fullscreen(){
      const me = this
      let isFull = me.fullscreenText == '全屏'
      if(isFull){
        me.$bus.$emit('change-monitoring-layout', {
          topHeight: '0px',
          leftWidth: '0px',
          rightWidth: '0px'
        })
        me.fullscreenText = '返回'
        // 发送事件 通知流量器 更新播放器宽高
        // 宽度增加80px  高度增加24px 
        // let playerCnt = document.getElementsByTagName('object').length;
        // me.$bus.$emit('on-e-player-to-fullscreen', playerCnt);
      }else{
        me.$bus.$emit('change-monitoring-layout', {
          topHeight: '72px',
          leftWidth: '240px',
        })
        me.fullscreenText = '全屏'
      }
    
    },
    maxView(){
      let me = this;
      debugger
      if(me.maxViewText =='最大化'){
        let playerCnt = document.getElementsByTagName('object').length;
        me.$bus.$emit('on-e-player-to-maxscreen', playerCnt);
        me.isShowFullScreen = false;
        me.maxViewText = '还原';
      }else{
        let playerCnt = document.getElementsByTagName('object').length;
        me.$bus.$emit('on-e-player-to-fullscreen', playerCnt);
        me.isShowFullScreen = true;
        me.maxViewText = '最大化';
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ecameractrl{
  width: 100%;
  height: 40px;
  background: rgba(16, 23, 64, 1);
  &__tool{
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 5px;
    color: white;
  }
  &__item{
    :hover{
      background: #1e326d
    }
  }


}
</style>
