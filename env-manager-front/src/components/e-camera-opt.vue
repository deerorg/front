<template>
  <div class="ecameraopt" v-if="control.isShow">
        <h5 class="ecameraopt__title">监控操作</h5>
        <section class="ecameraopt__panel">
            <span  class="ecameraopt__top ecameraopt__item" title="向上" @click="ipcAdjust('up')">
                <icon-svg icon-class="shang1" size="18px"></icon-svg>
            </span>
            <div class="ecameraopt__center">
                <span class="ecameraopt__left  ecameraopt__item" title="向左"  @click="ipcAdjust('left')">
                    <icon-svg icon-class="shang1" size="18px"></icon-svg>
                </span>
                <span class="ecameraopt__middle  ecameraopt__item" title="停止" @click="ipcAdjust('stop')">
                    <icon-svg icon-class="stop1" size="20px"></icon-svg>
                </span>
                <span class="ecameraopt__right  ecameraopt__item" title="向右" @click="ipcAdjust('right')">
                    <icon-svg icon-class="shang1" size="18px"></icon-svg>
                </span>
            </div>
            <span class="ecameraopt__bottom ecameraopt__item" title="向下" @click="ipcAdjust('down')">
                 <icon-svg icon-class="shang1" size="18px"></icon-svg>
            </span>
        </section>

        <section class="ecameraopt__adjust">
            <!-- 光圈
         <icon-svg icon-class="icon38" size="30px"></icon-svg><br/> -->
        <div class="ecameraopt__adjust--item">
            <icon-svg icon-class="speed" size="24px"></icon-svg>
            <span class="ecameraopt__adjust--name">速度快慢</span>
            <span class="ecameraopt__adjust--value">{{settings.sudu}}</span>
            <el-slider v-model="settings.sudu" :min="0" :max="1" :step="0.1" ></el-slider>
        </div>
        <div class="ecameraopt__adjust--item">
            <icon-svg icon-class="friends" size="24px"></icon-svg>
            <span class="ecameraopt__adjust--name">光圈大小</span>
            <span class="ecameraopt__adjust--value">{{settings.guangquan}}</span>
            <el-slider v-model="settings.guangquan" ></el-slider>
        </div>
        <div class="ecameraopt__adjust--item">
            <icon-svg icon-class="icon38" size="24px"></icon-svg>
            <span class="ecameraopt__adjust--name">焦距远近</span>
            <span class="ecameraopt__adjust--value">{{settings.jiaoju}}</span>
            <el-slider v-model="settings.jiaoju"></el-slider>
        </div>
        <div class="ecameraopt__adjust--item">
            <icon-svg icon-class="liangdu3" size="24px"></icon-svg>
            <span class="ecameraopt__adjust--name">亮度高低</span>
            <span class="ecameraopt__adjust--value">{{settings.liangdu}}</span>
            <el-slider v-model="settings.liangdu"></el-slider>
        </div>
  
        </section>


        <section class="ecameraopt__location">
            预置位
            <el-select v-model="currentLocation" placeholder="请选择位置" @change="changePos">
                <el-option
                v-for="item in locations"
                :key="item.id"
                :label="item.position"
                :value="item.id">
                <span style="float: left">{{ item.position }}</span>
                <span style="float: right; color: #fff; font-size: 16px">
                    <!-- <icon-svg icon-class="bianji" size="16px" @click="confirmPosModify" v-if="false"></icon-svg>  -->
                    <span title="删除位置" @click.stop="confirmPosDelete(item)">
                        <icon-svg icon-class="shanchu" size="16px"></icon-svg>       
                    </span>
                </span>
                </el-option>
            </el-select>
            <!-- <icon-svg icon-class="shuaxin" size="18px" title="调用"></icon-svg>  -->
            <el-popover
                    ref="addPos"
                    placement="top"
                    width="240"
                    class="add-pos"
                    title="添加位置"
                    default-first-option
                    v-model="isShowAddPos">
                    <h3>位置名称</h3>
            <el-input v-model="addPosName"></el-input>
            <div style="text-align: right; margin-top:10px">
                <el-button size="mini" type="text" @click="isShowAddPos = false">取消</el-button>
                <el-button type="primary" size="mini" @click="confirmAddPos">确定</el-button>
            </div>
            </el-popover>
            <span  title="添加"><icon-svg icon-class="plus"   size="20px"  v-popover:addPos></icon-svg> </span>
        </section>

        <section class="ecameraopt__change">
          视频源
          <el-select v-model="currentChooseIpcId" placeholder="请选择摄像头" @change="changeIpc" >
            <el-option v-for="item in ipcList" :key="item.id" :label="item.ipcName" :value="item.id">
              <span style="float: left">{{ item.ipcName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.status | IPCStatusFilter }}</span>
            </el-option>
          </el-select>
        </section>

        <section class="ecameraopt__look">
            <el-button @click="lookHistory">查看录播</el-button>
        </section>

  </div>
</template>

<script>
import { getInfo, postItem } from '@/api/advanced'
import {mapGetters} from 'vuex'
export default {
  name: 'ecameraopt',
  data() {
    return {
      currentLocation: '',
      locations: [],
      isShowAddPos: false,
      addPosName: '',
      currentChooseIpc:{},
      currentChooseIpcId: 0,
      ipcList:[]
    }
  },
  computed:{
    myIpc(){
      let me = this
      let result = me.currentChooseIpc.id ==null ? me.ipc: me.currentChooseIpc
      return result
    },
    ...mapGetters(['tenantId'])
  },
  mounted() {
    const me = this
    if (me.myIpc && me.myIpc.id) {
      // 获取摄像头位置信息
      me.currentChooseIpcId = me.myIpc.id
      me.getPosList()
    }
    me.getIpcList()
  },
  props: {
    settings: {
      type: Object,
      default() {
        return {
          guangquan: 50,
          jiaoju: 50,
          liangdu: 50,
          sudu: 0.5

        }
      }
    },
    control: {
      type: Object,
      default() {
        return {
          isShow: true
        }
      }
    },
    // 摄像头信息
    ipc: {
      type: Object
    }
  },
  methods: {
    lookHistory() {
      console.log("todo 查看录播")
    },
    getPosList() {
      const me = this
      getInfo("/ipc/position-list?ipcId=" + me.myIpc.id)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.locations = data
            // 获取数据
          } else {
            me.$message.error(msg)
          }
        })
    },

    // 获取摄像头列表
    getIpcList() {
      const me = this
      const url = `/ipc/lists?tenantId=${me.tenantId}&&pageNum=1&pageSize=50`
      postItem(url)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.ipcList = data.list
            // 获取数据
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },

    changeIpc(ipcId){
      let me = this
      me.currentChooseIpcId = ipcId
      me.currentChooseIpc = me.ipcList.find(x=>x.id==ipcId)
      if(me.currentChooseIpc.status == 'allotSuccess' || me.currentChooseIpc.status == 'recording'){
        me.getPosList()
      }
    },
    // 摄像头控制
    ipcAdjust(type) {
      const me = this
      const item = me.ipc
      item.type = type
      item.speed = me.settings.sudu
      postItem("/ipc/ctrl", item).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          // 更改成功
        } else {
          me.$message.error(msg)
        }
      })
    },
    // 确认位置
    confirmAddPos() {
      const me = this
      const addPosItem = {
        ipcId: me.ipc.id,
        position: me.addPosName
      }
      getInfo(`/ipc/position?ipcId=${me.myIpc.id}&position=${me.addPosName}`, me.addPosItem)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.$message.success("添加成功")
            me.isShowAddPos = false
            me.getPosList()
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },

    // 删除位置
    confirmPosDelete(item) {
      const me = this
      debugger
      getInfo("/ipc/position-del?id=" + item.id, { id: item.id }).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.$message.success("删除成功")
          me.getPosList()
        } else {
          me.$message.error(msg)
        }
      })
    },

    confirmPosModify(item) {
      const me = this
      postItem('/ipc/position-edit', me.item)
        .then(response => {
          const {
            success,
            data,
            msg
          } = response.data
          if (success) {
            me.$message.success("修改成功")
            me.getPosList()
          } else {
            me.$message.error(msg)
          }
        }).catch(err => {
          me.$message.error("网络错误")
        })
    },

    changePos(posId) {
      const me = this
      getInfo("/ipc/position-move?id=" + posId, { id: posId }).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          console.log("move success")
        } else {
          me.$message.error(msg)
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.ecameraopt{
    position: relative;
    width: 320px;
    height: 100%;
    min-height: 100%;
    background:rgba(59,140,255,0.3);
    &__title{
        background:rgba(59,140,255,0.3);
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-top: 0px; 
        margin-bottom: 40px; 
    }
    &__panel{
        height: 200px;
        padding-left: 60px;
        padding-right: 60px;
    }
    &__item{
        width:60px;
        height:60px; 
        display: inline-block;
        border:2px solid #fff;
        padding-left: 19px;
        padding-top: 19px; 
        background:rgba(255,255,255, 0.2);
        &:hover{
            background:rgba(30, 50, 109, 1);
            border:2px solid rgba(255,255,255, 0.5);
        }
    }
    
    &__top{
        margin-left: 70px;
      
    }
    &__bottom{
        margin-left: 70px;
        margin-top: -5px;
        transform: rotate(180deg); 
    }
    &__left{
        transform: rotate(270deg); 
    }
    &__right{
        transform: rotate(90deg); 
    }
    &__center{
        height: 80px;
        padding-top: 8px;
    }
    &__middle{
        margin-left: 5px;
        margin-right: 5px; 
    }
    &__adjust{
        margin-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        &--value{
            float: right;
        }
    }
    &__location{
        margin-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        & .el-select{
            width: 150px;
        } 
    }
    &__change{
      margin-top: 20px;
      padding-left: 20px;
      padding-right: 20px;
    }
    &__look{
        margin-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        margin-bottom: 20px;
    }

}
</style>
