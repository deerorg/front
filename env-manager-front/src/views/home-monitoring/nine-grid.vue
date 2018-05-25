<template>
  <div class="monitoringIndex9">
    <div class="monitoringIndex9__left">
    <el-row type="flex" class="row-bg">
        <el-col :span="8"><div class="grid-content bg-purple">
        <e-player  :ipc="ipc" v-if="isShowIpc" player-id="infore_ipc_90"  @on-choose-player="onChoosePlayer"></e-player>
        </div>
        </el-col>
        <el-col :span="8">
            <div class="grid-content bg-purple-light">
                <e-player    :ipc="ipc2" v-if="isShowIpc2" @on-choose-player="onChoosePlayer" player-id="infore_ipc_91" ></e-player>
            </div>
        </el-col>
         <el-col :span="8">
            <div class="grid-content bg-purple-light">
                <e-player    :ipc="ipc2" v-if="isShowIpc2" @on-choose-player="onChoosePlayer" player-id="infore_ipc_92" ></e-player>
            </div>
        </el-col>
    </el-row>
    <el-row type="flex">
        <el-col :span="8"><div class="grid-content bg-purple">
        <e-player   :ipc="ipc3" v-if="isShowIpc3" @on-choose-player="onChoosePlayer" player-id="infore_ipc_93" ></e-player>
        </div>
        </el-col>
        <el-col :span="8">
            <div class="grid-content bg-purple-light">
                <e-player   :ipc="ipc4" v-if="isShowIpc4" @on-choose-player="onChoosePlayer" player-id="infore_ipc_94" ></e-player>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="grid-content bg-purple-light">
                <e-player   :ipc="ipc4" v-if="isShowIpc4" @on-choose-player="onChoosePlayer" player-id="infore_ipc_95" ></e-player>
            </div>
        </el-col>
    </el-row>
    <el-row type="flex">
        <el-col :span="8"><div class="grid-content bg-purple">
        <e-player   :ipc="ipc3" v-if="isShowIpc3" @on-choose-player="onChoosePlayer" player-id="infore_ipc_96" ></e-player>
        </div>
        </el-col>
        <el-col :span="8">
            <div class="grid-content bg-purple-light">
                <e-player   :ipc="ipc4" v-if="isShowIpc4" @on-choose-player="onChoosePlayer" player-id="infore_ipc_97" ></e-player>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="grid-content bg-purple-light">
                <e-player   :ipc="ipc4" v-if="isShowIpc4" @on-choose-player="onChoosePlayer" player-id="infore_ipc_98" ></e-player>
            </div>
        </el-col>
    </el-row>
    <e-camera-ctrl></e-camera-ctrl>
  </div>

  </div>
</template>

<script>
import ECameraOpt from '@/components/e-camera-opt'
import ECameraCtrl from '@/components/e-camera-ctrl'
import EPlayer from '@/components/e-player'
const testIpc = {
  firmware: "V5.4.22 build 170210",
  hlsUrl: "http://192.168.37.17:9092/ipc_4/index.m3u8",
  hwid: null,
  id: 4,
  ip: "192.168.31.64",
  ipcInfo: null,
  ipcName: "摄像头(正常)",
  manufactor: "HIKVISION",
  model: "DS-2DC2204IW-D3/W",
  ntpDns: null,
  port: "80",
  profileToken: "Profile_1",
  regId: "192.168.37.17:8686",
  remoteFlag: "Y",
  rtmpUrl: "rtmp://192.168.37.17:1935/live/ipc_4",
  rtspUrl: "rtsp://192.168.31.64:80:554/Streaming/Channels/101?transportmode=unicast&profile=Profile_1",
  siteId: 2,
  sn: "DS-2DC2204IW-D3/W20170418CCCH749821935",
  status: "allotSuccess",
  taskId: 3,
  taskName: null,
  tenantId: 1,
  usrName: "admin",
  usrPwd: "info@2017"
}

export default {
  name: 'monitoringIndex9',
  components: {
    ECameraOpt, EPlayer,ECameraCtrl
  },
  data() {
    return {
      size: {
        width: 660,
        height: 417
      },
      // 摄像头信息
      ipc: testIpc,
      ipc2: {},
      // 是否显示摄像头
      isShowIpc: false,
      isShowIpc2: false,
      isShowIpc3: false,
      isShowIpc4: false,

      // myControl: {
      //   isShowOpt: false,
      // },
      // 当前选择的播放器
      currentChoosePlayer: {},

      fullscreenText: '全屏',

      control:{
        isShowOpt: true
      }
    }
  },
  mounted() {
    const me = this
    // 监控摄像头信息
    me.ipc2 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc3 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc4 = JSON.parse(JSON.stringify(me.ipc))

    me.ipc2.id = 24
    me.ipc3.id = 34
    me.ipc4.id = 44
    me.isShowIpc = true
    me.isShowIpc2 = true
    me.isShowIpc3 = true
    me.isShowIpc4 = true

    me.$bus.$on('on-ipcdata-to-ipc-player', function(ipcDetailInfo) {
      me.isShowIpc = false
      me.ipc = ipcDetailInfo
      if (me.ipc.id) {
        me.isShowIpc = true
      }
    })
  },
  methods: {
    onChoosePlayer(currentIpc) {
      const me = this
      me.currentChoosePlayer = currentIpc
    },
    fullscreen() {
      const me = this
      let isFull = me.fullscreenText == '全屏'
      if(isFull){
        me.$bus.$emit('change-monitoring-layout', {
          topHeight: '0px',
          leftWidth: '0px',
          rightWidth: '0px'
        })
        me.fullscreenText = '返回'
      }else{
        me.$bus.$emit('change-monitoring-layout', {
          topHeight: '72px',
          leftWidth: '240px',
          rightWidth: '320px'
        })
        me.fullscreenText = '全屏'
      }
    
    }

  }
}
</script>
<style lang="scss" scoped>
.monitoringIndex9 {
  height: 100%;
  width: 100%;
  display: flex;
  &__left{
    flex: 1;
    width: auto;
    background: RGBA(3, 6, 38, 1)
    // min-width: 640px;
  }
 

}
</style>
