<template>
  <div class="monitoringIndex">
    <!--  -->
      <h3>监控页面</h3>
      <e-player :control="control" :size="size"  :ipc="ipc" v-if="isShowIpc" player-id="infore_ipc_00"></e-player>
      <e-camera-ctrl  v-if="isShowIpc"></e-camera-ctrl>
  </div>
</template>

<script>
import ECameraOpt from '@/components/e-camera-opt'
import ECameraCtrl from '@/components/e-camera-ctrl'
import EPlayer from '@/components/e-player'
export default {
  name: 'monitoringIndex',
  components: {
    ECameraOpt, EPlayer, ECameraCtrl
  },
  data() {
    return {
      size: {
        width: 1280,
        height: 738
      },
      flashvars: {
        f: 'rtmp://192.168.37.17:1935/live/ipc_4',
        c: 0,
        p: 1,
        i: 'http://www.ckplayer.com/static/images/cqdw.jpg'
      },
      // 摄像头信息
      ipc: {},
      // 是否显示摄像头
      isShowIpc: false,
      control:{
        isShowOpt: true,
        isShowList : false
      }
    }
  },
  mounted() {
    const me = this
    // 监控摄像头信息
    me.$bus.$on('on-ipcdata-to-ipc-index', function(ipcDetailInfo) {
      debugger;
      me.isShowIpc = false
      me.ipc = ipcDetailInfo
      me.$bus.$emit('on-ipcdata-to-ipc-player', ipcDetailInfo)
      if (me.ipc.id) {
        me.isShowIpc = true
      }
    })
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.monitoringIndex{

}
</style>
