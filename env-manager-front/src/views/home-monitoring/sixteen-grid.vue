<template>
  <div class="monitoringIndex4">

    <el-row type="flex" class="row-bg">
        <el-col :span="6"><div class="grid-content bg-purple">
        <e-player  :control="myControl"  :ipc="ipc" v-if="isShowIpc"   @on-choose-player="onChoosePlayer"></e-player>
        </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple-light">
                <e-player    :control="myControl" :ipc="ipc2" v-if="isShowIpc2" @on-choose-player="onChoosePlayer"></e-player>
            </div>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple">
        <e-player  :control="myControl"  :ipc="ipc3" v-if="isShowIpc3"   @on-choose-player="onChoosePlayer"></e-player>
        </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple-light">
                <e-player    :control="myControl" :ipc="ipc4" v-if="isShowIpc4" @on-choose-player="onChoosePlayer"></e-player>
            </div>
        </el-col>
    </el-row>
      
    <el-row type="flex" class="row-bg">
        <el-col :span="6"><div class="grid-content bg-purple">
        <e-player  :control="myControl"  :ipc="ipc5" v-if="isShowIpc5"   @on-choose-player="onChoosePlayer"></e-player>
        </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple-light">
                <e-player    :control="myControl" :ipc="ipc6" v-if="isShowIpc6" @on-choose-player="onChoosePlayer"></e-player>
            </div>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple">
        <e-player  :control="myControl"  :ipc="ipc7" v-if="isShowIpc7"   @on-choose-player="onChoosePlayer"></e-player>
        </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple-light">
                <e-player    :control="myControl" :ipc="ipc8" v-if="isShowIpc8" @on-choose-player="onChoosePlayer"></e-player>
            </div>
        </el-col>
    </el-row>

        <el-row type="flex" class="row-bg">
        <el-col :span="6"><div class="grid-content bg-purple">
        <e-player  :control="myControl"  :ipc="ipc9" v-if="isShowIpc9"   @on-choose-player="onChoosePlayer"></e-player>
        </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple-light">
                <e-player    :control="myControl" :ipc="ipc10" v-if="isShowIpc10" @on-choose-player="onChoosePlayer"></e-player>
            </div>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple">
        <e-player  :control="myControl"  :ipc="ipc11" v-if="isShowIpc11"   @on-choose-player="onChoosePlayer"></e-player>
        </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple-light">
                <e-player    :control="myControl" :ipc="ipc12" v-if="isShowIpc12" @on-choose-player="onChoosePlayer"></e-player>
            </div>
        </el-col>
    </el-row>

        <el-row type="flex" class="row-bg">
        <el-col :span="6"><div class="grid-content bg-purple">
        <e-player  :control="myControl"  :ipc="ipc13" v-if="isShowIpc13"   @on-choose-player="onChoosePlayer"></e-player>
        </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple-light">
                <e-player    :control="myControl" :ipc="ipc14" v-if="isShowIpc14" @on-choose-player="onChoosePlayer"></e-player>
            </div>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple">
        <e-player  :control="myControl"  :ipc="ipc15" v-if="isShowIpc15"   @on-choose-player="onChoosePlayer"></e-player>
        </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple-light">
                <e-player    :control="myControl" :ipc="ipc16" v-if="isShowIpc16" @on-choose-player="onChoosePlayer"></e-player>
            </div>
        </el-col>
    </el-row>
    
    
    
     
  </div>
</template>

<script>
import ECameraOpt from '@/components/e-camera-opt'
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
  name: 'monitoringIndex4',
  components: {
    ECameraOpt, EPlayer
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
      ipc3: {},
      ipc4: {},
      ipc5: {},
      ipc6: {},
      ipc7: {},
      ipc8: {},
      ipc9: {},
      ipc10: {},
      ipc11: {},
      ipc12: {},
      ipc13: {},
      ipc14: {},
      ipc15: {},
      ipc16: {},

      // 是否显示摄像头
      isShowIpc: false,
      isShowIpc2: false,
      isShowIpc3: false,
      isShowIpc4: false,
      isShowIpc5: false,
      isShowIpc6: false,
      isShowIpc7: false,
      isShowIpc8: false,
      isShowIpc9: false,
      isShowIpc10: false,
      isShowIpc11: false,
      isShowIpc12: false,
      isShowIpc13: false,
      isShowIpc14: false,
      isShowIpc15: false,
      isShowIpc16: false,

      myControl: {
        isShowOpt: false
      },
      // 当前选择的播放器
      currentChoosePlayer: {}

    }
  },
  mounted() {
    const me = this
    // 监控摄像头信息
    me.ipc2 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc3 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc4 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc5 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc6 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc7 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc8 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc9 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc10 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc11 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc12 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc13 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc14 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc15 = JSON.parse(JSON.stringify(me.ipc))
    me.ipc16 = JSON.parse(JSON.stringify(me.ipc))

    me.ipc2.id = 24
    me.ipc3.id = 34
    me.ipc4.id = 'ipc4'
    me.ipc5.id = 'ipc5'
    me.ipc6.id = 'ipc6'
    me.ipc7.id = 'ipc7'
    me.ipc8.id = 'ipc8'
    me.ipc9.id = 'ipc9'
    me.ipc10.id = 'ipc10'
    me.ipc11.id = 'ipc11'
    me.ipc12.id = 'ipc12'
    me.ipc13.id = 'ipc13'
    me.ipc14.id = 'ipc14'
    me.ipc15.id = 'ipc15'
    me.ipc16.id = 'ipc16'

    me.isShowIpc = true
    me.isShowIpc2 = true
    me.isShowIpc3 = true
    me.isShowIpc4 = true
    me.isShowIpc5 = true
    me.isShowIpc6 = true
    me.isShowIpc7 = true
    me.isShowIpc8 = true
    me.isShowIpc9 = true
    me.isShowIpc10 = true
    me.isShowIpc11 = true
    me.isShowIpc12 = true
    me.isShowIpc13 = true
    me.isShowIpc14 = true
    me.isShowIpc15 = true
    me.isShowIpc16 = true

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
      console.log(currentIpc)
      me.currentChoosePlayer = currentIpc
    }

  }
}
</script>
<style lang="scss" scoped>
.monitoringIndex4 {
}
</style>
