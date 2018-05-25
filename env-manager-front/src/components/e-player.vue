<template>
  <div class="eplayer">
    <div :id="playerId"  :name="myIpc.ipcName" :style="{height:size.height, width:size.width}"  class="eplayer__video">
    </div>
    <!-- -->
    <el-collapse-transition>
    <section class="eplayer__list" v-if="control.isShowList"  :class="{'list-title-hide':!isShowRightList, 'list-title-show':isShowRightList}" > 
       <span>
         <!-- @mouseover="onmouseover" -->
        <span @click="toggleList" title="摄像头列表" ><icon-svg icon-class="zhankai" size="20px"></icon-svg></span>
        <transition enter-active-class="fadeInLeft" leave-active-class="fadeOutLeft">
          <section  v-show="isShowRightList" class="animated">
            <span >
            <el-input v-model="searchName" placeholder="检索摄像头" class="eplayer" @keyup.enter.native="searchIpc">
             <i slot="suffix" class="el-input__icon el-icon-search" @click="searchIpc"></i>
            </el-input>
            </span>
          <ul class="eplayer__list--ul" >
            <li v-for="item in ipcList" :key="item.id" @click="chooseIpc(item)" :class="{'is-choose': item.isChoose}">
              <span :title="item.ipcStateText"><icon-svg :icon-class="item.ipcStateCls" size="20px"></icon-svg></span> 
              {{item.ipcName}} 
            </li>
          </ul>
          </section>
      </transition> 
      </span>
    </section>
    </el-collapse-transition> 
    <e-camera-opt class="eplayer__video-opt" :ipc="myIpc" v-if="control.isShowOpt"></e-camera-opt>
  </div>
</template>

<script>
import ECameraOpt from '@/components/e-camera-opt'
import {postItem} from '@/api/advanced'
import {mapGetters} from 'vuex'

import Config from '@/config'
// 是否加载播放器js;
let isLoadJS = false
export default {
  name: 'eplayer',
  props: {
    params: {
      type: Object,
      default() {
        return {
          bgcolor: '#FFF',
          allowFullScreen: true,
          allowScriptAccess: 'always',
          wmode: 'transparent'
        }
      }
    },

    // 播放器大小
    size: {
      type: Object,
      default() {
        return {
          width: '512px',
          // width:'460px',
          height: '288px'
        }
      }
    },

    // 摄像头信息 可以传入 也可以不传入  采用data myipc 播放 如果传入 使用ipc播放 
    ipc: {
      type: Object,
      required: false
    },
    // 控制是否显示右侧控制盘 默认显示
    control: {
      type: Object,
      default() {
        return {
          isShowOpt: false,
          isShowList : true
        }
      }
    },
    // 播放器的ID 
    playerId:{
      type: String,
      required: true
    }

  },
  components: {
    ECameraOpt
  },
  computed:{
    ...mapGetters([ 'tenantId']),
  },
  data() {
    return {
      // 播放器参数
      flashvars: {
        f: '',
        c: 0,
        p: 1,
        i: Config.IPC.ERROR_URL
      },
      ipcList:[],
      rawIpcList: [],
      // 是否显示视频源列表
      isShowRightList : false,
      isUserByClick: false,
      // 视频播放
      myIpc :{}, 
      searchName: '',
    }
  },
  mounted() {
    const me = this
    me.myIpc = me.ipc
    me.getIpcList()
    me.gotoPlay()
    // 更改myipc  始终 使用myipc的视频源播
    me.$bus.$on('on-ipcdata-to-ipc-player', function(ipcDetailInfo) {
      me.myIpc = ipcDetailInfo
      me.gotoPlay()
    })
    // 全屏 事件 
    // 发送事件 通知流量器 更新播放器宽高 最大化屏幕播放器
    me.$bus.$on('on-e-player-to-maxscreen',function(orginType){
      debugger;
        if(orginType==1){
          me.size.width = parseInt(me.size.width) + 240 + 'px';
          me.size.height = parseInt(me.size.height) + 72 + 'px';
        }else if(orginType==4){
          me.size.width = parseInt(me.size.width) + 120 +'px'; 
          me.size.height = parseInt(me.size.height) + 36+ 'px';
        }else if(orginType==9){
          me.size.width = parseInt(me.size.width) + 80 + 'px';
          me.size.height = parseInt(me.size.height) + 24 + 'px';
        }
        me.gotoPlay();
    });

    // 还原页面
    me.$bus.$on('on-e-player-to-fullscreen',function(orginType){
      debugger;
      if(orginType==1){
          me.size.width = parseInt(me.size.width) - 240 + 'px';
          me.size.height = parseInt(me.size.height) - 72 + 'px';
        }else if(orginType==4){
          me.size.width = parseInt(me.size.width) - 120 +'px'; 
          me.size.height = parseInt(me.size.height) - 36+ 'px';
        }else if(orginType==9){
          me.size.width = parseInt(me.size.width) - 80 + 'px';
          me.size.height = parseInt(me.size.height) - 24 + 'px';
        }
        me.gotoPlay();
    });

  },

  methods: {
    loadJS() {
      const me = this
      if (!isLoadJS) {
        var head = document.getElementsByTagName('head')[0]
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = Config.IOT_PLAYER_URL_PRE + 'ckplayer.js'
        head.appendChild(script)
        isLoadJS = true
      }
    },
    onmouseover(){
      let me = this;
      me.isShowRightList= true;
      setTimeout(function(){
        if(me.isUserByClick && me.isShowRightList){
          return;
        }else{
          me.isShowRightList = false;
        }
      }, 5000)
    },
    // 获取ipc列表
    getIpcList() {
      const me = this
      const url = `/ipc/lists?tenantId=${me.tenantId}&pageNum=1&pageSize=1000`
      postItem(url)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.ipcList = data.list.map(x=>{
              x.uuid = `infore_ipc_${x.id}`
              x.ipcStateCls = (x.status == 'allotSuccess' || me.myIpc.status == 'recording')?'shexiangtouxianxing':'shexiangtou_jinyong'
              x.ipcStateText = (x.status == 'allotSuccess' || me.myIpc.status == 'recording')? '正常':'异常'
              return x
            })
            me.total = data.total
            if(me.myIpc.id){
              me.ipcList = data.list.map(x=> {x.isChoose = x.id ===me.myIpc.id; return x; });
            }
            me.rawIpcList = me.ipcList;  
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },

    // 返回当前激活的ipc
    onChoosePlayer() {
      const me = this
      me.$emit('on-choose-player', me.ipc)
    },
    toggleList(){
      let me = this;
      // 通过点击触发
      me.isUserByClick = true;
      me.isShowRightList = !me.isShowRightList 
    },
    chooseIpc(item){
      let me = this
      me.myIpc = item
      me.ipcList.map(x => {x.isChoose = x.id ===me.myIpc.id; return x; })
      me.isShowRightList = false
      me.gotoPlay()

    },

    searchIpc(){
      let me = this
      debugger
      if(me.searchName){
        me.ipcList = me.rawIpcList.filter(x=>x.ipcName.indexOf(me.searchName) > -1)
      }else{
        me.ipcList = me.rawIpcList
      }
    },
    // 播放
    gotoPlay() {
      let me = this
      if (me.myIpc && me.myIpc.id) {
        // 摄像头状态正常
        if (me.myIpc.rtmpUrl && (me.myIpc.status == 'allotSuccess' || me.myIpc.status == 'recording')) {
          me.flashvars = {
            f: me.myIpc.rtmpUrl,
            c: 0,
            p: Config.IPC.AUTOPLAY || 0,
            i: Config.IPC.NORMAL_URL
          }
        } else {
          //  摄像头异常
          me.flashvars = {
            f: Config.IPC.DEFAULT_URL,
            c: 0,
            p: 0,
            i: Config.IPC.ERROR_URL
          }

          me.$message.error("摄像头连接异常, 请稍后重试")
        }
      }

      if (CKobject && me.myIpc.id) {
        CKobject.embedSWF(Config.IOT_PLAYER_URL_PRE + 'ckplayer.swf', me.playerId, 'ckplayer_infore_' + me.myIpc.id, me.size.width, me.size.height, me.flashvars, me.params)
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.eplayer{
    display: flex;
    padding: 10px;
    position: relative;
    // overflow: hidden;
    &__video{
      flex: 1;
      max-width: 100%;
    }
    &__video-opt{
        width: 320px;
        max-width: 320px;
        overflow: hidden;        
    }
    &__input{
      // z-index: -1;
      width: 114px;
    }
    &__list{
      position: absolute;
      min-height: calc( 100% - 20px);
      width: 160px;
      max-width: 160px;
      user-select: none;
      // min-height: calc( 100% );
      min-width: 140px;
      background: rgba(59, 140, 255, 0.3);
      transition: width 0.5s ease-in-out, height 1s ease-in-out;
      left: 10px;
      > span {
        height: 40px;
        display: inline-block;
        line-height: 40px;
        z-index: 99;
        &:hover{
          transform: translateZ(99);
        }
      }
      &--ul{
        list-style-type: none;
        margin:0;
        padding: 0;
        z-index: -1;
        overflow: hidden scroll;
        font-size: 14px; 
        transition: all 1s ease-in-out;
      }
      &--ul > li{
        height: 40px;
        line-height: 40px;
        &:hover,{
          background-color: rgba(59, 140, 255, 0.3);
        }
      }
      &--ul > li.is-choose{
        background-color: rgba(59, 140, 255, 0.3);
      }
    }

    .list-title-hide{
      height: 40px;
      background: transparent;
    }

    .list-title-show{
      height: auto;
      background-color: rgba(59, 140, 255, 0.3);
    }
}
</style>
