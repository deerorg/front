<template>
  <div class="monitoringone">
    <e-player :control="oneControl" :size="size"  :ipc="ipc" v-if="isShowIpc" player-id="infore_ipc_10"></e-player>
    <e-camera-ctrl></e-camera-ctrl>
  </div>
</template>

<script>
import ECameraCtrl from '@/components/e-camera-ctrl'
import EPlayer from '@/components/e-player'
import { mapGetters } from 'vuex'
import { postItem } from '@/api/advanced'
export default {
  name: 'monitoringone',
  components: {
    ECameraCtrl, EPlayer
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
      // 是否自动注入 默认查找当租户下的第一个已经分配的摄像头 进行视频播放
      autoFind: true ,

      oneControl:{
        isShowOpt: true,
        isShowList : false
      }
    }
  },
  computed:{
    ...mapGetters(['tenantId'])
  },
  mounted() {
    const me = this
    // 监控摄像头信息
    me.$bus.$on('on-ipcdata-to-ipc-player', function(ipcDetailInfo) {
      me.isShowIpc = false
      me.ipc = ipcDetailInfo
      if (me.ipc.id) {
        me.isShowIpc = true
      }
    });

    if(me.autoFind){
      me.getIpcList();
    }


  },
  methods: {
      getIpcList() {
      const me = this
      const url = `/ipc/lists?tenantId=${me.tenantId}&pageNum=1&pageSize=20`
      postItem(url)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.list = data.list
            me.total = data.total

            // 触发 全局事件 更改对应播放器的 视频源
            if(me.total >= 1){
              me.ipc = me.list[0]
              me.isShowIpc = true
            }
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
  }
}
</script>
<style lang="scss" scoped>
.monitoringone{

}
</style>
