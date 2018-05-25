<template>
<div class="e-choose-metekind">
    <div class="e-choose-metekind__wrapper">
    <div class="info-tree">
        <el-tree
            ref="eChooseMetekindTree"
            :data="deviceTypeTree"
            show-checkbox
            :props="defaultProps"
            :expand-on-click-node="true"
            :highlight-current="true"
            :default-checked-keys="defaultCheckedKeys"
            @current-change="currentChange"
            @check-change="checkChange"
            node-key="id"
            class="e-choose-metekind-tree">
        </el-tree>
    </div>

    <section>
        <h4>告警级别</h4>
    <el-checkbox-group v-model="chooseLevels.currentChooseLevel"  @change="change" :min="1">
        <el-checkbox   v-for="item in reportLevels" :label="item.levelName" :key="item.reportLevel" :title="item.levelName">{{item.levelName}}</el-checkbox>
    </el-checkbox-group>

    </section>
  </div>
</div>

</template>


<script>
import { getInfo, postItem } from "@/api/advanced"
import { mapGetters } from 'vuex'

export default {
  name: "e-choose-metekind",
  props: {
    // 设备模型
    control: {
      type: Object,
      default: () => {
        return {

        }
      }
    },
    // 选择的告警级别
    chooseLevels: {
      type: Object,
      default() {
        return {
          currentChooseLevel: []
        }
      }
    },
    // 选择的告警量
    chooseMetetypes: {
      type: Array,
      default() {
        return []
      }
    }
    // :choose-levels="control.chooseData.reportLevels" :choose-metetypes="control.chooseData.deviceMeteTypes"
  },
  data() {
    // 声明保存当前操作分类node对象
    this.__currentNode = null
    return {
      defaultProps: {
        label: 'name',
        children: 'meteTypeList'
      },
      rawData: [],
      deviceTypeTree: [],
      currentChooseNode: null,
      currentSelf: null,
      currentData: null,

      reportLevels: [],
      // 默认选中的
      currentChooseLevel: [],
      // 默认选中的metetypes
      defaultCheckedKeys: []

    }
  },
  mounted() {
    const me = this
    me.getData()
  },

  methods: {
    getData() {
      const me = this
      getInfo("/cfguseralarmfilter/querytree4alarm")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.rawData = data
            me.deviceTypeTree = me.handlerData()
          } else {
            me.$message.error(msg)
          }
        })

      getInfo("/reportlevel/list")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.reportLevels = data
            if (me.control.type && me.control.type == 'edit') {
              const currentChooseLevels = me.reportLevels.filter(x => me.control.chooseData.reportLevels.indexOf(x.reportLevel) > -1) || []
              me.chooseLevels.currentChooseLevel = currentChooseLevels.map(y => y.levelName) || []
            }
          } else {
            me.$message.error(msg)
          }
        })
    },
    handlerData() {
      const me = this
      const dataArr = me.rawData.map(x => {
        x.id = Math.random().toString(10).substring(2)
        x.name = x.deviceTypeName
        let childNodes = x.meteTypeList
        childNodes = childNodes.map(y => {
          y.id = Math.random().toString(10).substring(2)
          y.name = y.meteTypeName
          return y
        })
        return x
      })
      // 添加顶级
      const arr = [
        {
          id: 0,
          name: '告警类型',
          meteTypeList: dataArr
        }
      ]

      if (me.control.type == 'edit') {
        me.handlerEditChoose(dataArr)
      }

      return arr
    },
    // 如果是选中状态 获取当前选中的数据 来处理
    handlerEditChoose(dataArr) {
      const me = this
      const chooseMetetypes = me.control.chooseData.deviceMeteTypes
      const ids = []
      for (let i = 0; i < chooseMetetypes.length; i++) {
        const item = chooseMetetypes[i]
        const itemChooseMeteTypes = item.meteTypes
        const matchTopItem = dataArr.find(x => x.deviceType == item.deviceType)
        if (matchTopItem && matchTopItem.meteTypeList) {
          const matchSencondIds = matchTopItem.meteTypeList.filter(y => itemChooseMeteTypes.indexOf(y.meteType) > -1).map(z => z.id)
          matchSencondIds.forEach(element => {
            ids.push(element)
          })
        }
      }
      me.defaultCheckedKeys = ids
    },

    currentChange(data, node) {
      console.log("current-change", data, node)
    },

    checkChange(data, isCheck, isChildCheck) {
      console.log("checkChange", data, isCheck, isChildCheck)
      const me = this
      const currentChooseNode = me.$refs.eChooseMetekindTree.getCheckedNodes(true)
      me.$emit('get-choose-tree-nodes', currentChooseNode)
    },
    change(arr) {
      const me = this
      const levelIds = me.reportLevels.filter(x => arr.indexOf(x.levelName) > -1).map(x => x.reportLevel) || []
      me.$emit('get-choose-levels', levelIds)
    }

  }
}
</script>

<style scoped>
.e-choose-metekind__wrapper {
  min-width: 400px;
  text-align: left;
}
.e-choose-metekind__top {
  padding: 10px;
  /* text-align: right; */
  /* border-bottom: 1px solid #ddd; */
}
.el-tree-node {
  position: relative;
}
.el-tree-node__content:hover .e-choose-metekind-bar {
  display: block;
}
.e-choose-metekind-bar {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 12px;
}
.e-choose-metekind-bar > i {
  margin: 0 5px;
  color: #999;
}
.e-choose-metekind-bar > i:hover {
  color: #20a0ff;
}

.e-choose-metekind .el-tree{
    color:#fff;
    background: transparent;
}


</style>