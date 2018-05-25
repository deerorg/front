<template>
<div class="e-select-site-gateway-tree">
    <div class="e-select-site-gateway-tree__wrapper">
        
    <div class="e-select-site-gateway-tree__top" v-if="control.isShowOpt">
           <el-button @click="confirmAddDevice" size="mini" v-if="control.isShowGateway">添加设备</el-button>
           <el-button @click="confirmAddGateway" size="mini" v-else>添加网关</el-button>
    </div>
    <div class="e-site-info-wrapper">
    <div class="info-tree">
        <el-tree
            ref="eSelectSiteGatewayTree"
            :data="treeData"
            show-checkbox
            :props="defaultProps"
            :expand-on-click-node="true"
            lazy
            :default-expand-all="true"
            :highlight-current="true"
            :load = "loadTreeNode"
            node-key="id"
            @check-change="currentChange"
            @node-click="handleNodeClick"
            :render-content="nodeRender"
            class="e-select-gateway-tree">
        </el-tree>
    </div>
    </div> 
  </div>
</div>

</template>


<script>
import { getInfo, postItem } from "@/api/advanced"
import { mapGetters } from 'vuex'

import ESelectAreaTree from '@/components/e-select-area-tree'

export default {
  name: "e-site-gateway-tree",
  components: {
    ESelectAreaTree
  },
  props: {
    // 设备模型
    deviceModel: [Number, String],
    control: {
      type: Object,
      default: () => {
        return {
          // 是否显示网关 如果是网关设备 则不能选择网关
          isShowGateway: true,
          // 只能选择网关
          isOnlyChooseGateway: true,
          isShowOpt: true
        }
      }
    }
  },
  computed: {
    deviceModelListFilterFsuList: function() {
      // 选择网关类型
      this.deviceModelList.filter(x => x.deviceKind == 3) || []
    },
    ...mapGetters(['tenantId', 'tenantName'])
  },
  data() {
    // 声明保存当前操作分类node对象
    this.__currentNode = null
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      currentChooseNode: null,
      currentSelf: null,
      currentData: null,
      treeData: []

    }
  },

  mounted() {
    const me = this
  },

  methods: {
    /* 加载子分类 */
    loadTreeNode(treeItem, resolve) {
      const me = this
      if (treeItem.level === 0) {
        return resolve([{ name: me.tenantName, id: 0 }])
      }
      if (treeItem.level === 1) {
        // 获取该租户下的所有站点
        getInfo(`/cfgsite/queryby?tenantId=${me.tenantId}`).then(data => {
          const child = data.data.data.map(x => {
            x.name = `${x.siteName}[${x.siteId}]-- ${x.precinctName}`
            // 如果只能选择网关
            if (me.control.isOnlyChooseGateway) {
              x.disabled = true
            }
            return x
          })
          resolve(child)
        })
      } else if (treeItem.data.siteId && treeItem.level == 2) {
        // 获取站点下的设备或网关
        if (me.control.isShowGateway) {
          getInfo(
            `/cfgdevice/queryby?tenantId=${me.tenantId}&siteId=${treeItem.data
              .siteId}`
          ).then(data => {
            console.log("获取站点下的设备或网关", data.data)
            const child = data.data.data.filter(x => x.fsuId == 0).map(x => {
              x.name = x.deviceName
              return x
            })
            resolve(child)
          })
        } else {
          resolve([])
        }
      } else {
        resolve([])
      }
      return resolve([])
    },

    currentChange(data, Node) {
      const me = this
      const currentChooseData = me.$refs.eSelectSiteGatewayTree.getCheckedNodes(true)
      me.$emit('get-choose-nodes', currentChooseData)
    },

    /* 点击响应时间 */
    handleNodeClick(item, node, self) {
      const me = this
      me.currentData = item
      me.currentChooseNode = node
      me.currentSelf = self
      // temp1.node.parent.removeChild(temp1.node)
      me.$emit("node-click", item, node, self)
      const currentChooseData = me.$refs.eSelectSiteGatewayTree.getCheckedNodes(true)
      me.$emit("get-choose-nodes", currentChooseData)
    },
    /* 构建分类title及工具 */
    nodeRender(h, { _self, node, data }) {
      // @todo: 使用jsx插件更好理解
      const type = ["precinct", "building", "floor", "room", "site", "device", "fsu"]
      if (data.fsuId == 0 && data.deviceId) {
        data.type = "fsu"
      } else if (data.deviceId && data.fsuId != 0) {
        data.type = "device"
      } else if (data.siteId) {
        data.type = "site"
      } else {
        data.type = "root"
      }
      const childrenNodes =
        data.id === 0
          ? [h("span", data.name)]
          : [
            h("i", {
              staticClass: 'p-tree-icon',
              class: data.type
            }),
            h("span", data.name),
            h(
              "span",
              {
                class: "e-select-site-gateway-tree-bar"
              }
            )
          ]
      return h(
        "div",
        {
          class: "el-tree-node__label",
          prop: {
            children: "-"
          }
        },
        childrenNodes
      )
    },

    /* 添加设备 */
    confirmAddDevice() {
      const me = this
      const chooseNode = me.$refs.eSelectSiteGatewayTree.getCheckedNodes(true)

      const filterGateways = chooseNode.filter(x => x.fsuId == 0)
      if (chooseNode.length <= 0 || filterGateways.length <= 0) {
        me.$message.info("请至少选择一个网关")
        return
      }
      const infos = {
        "deviceModel": me.deviceModel,
        "fsuIds": filterGateways.map(x => x.deviceId),
        "tenantId": me.tenantId
      }
      postItem('/cfgdevice/batchaddcomdev', infos).then(resp => {
        const { msg, success, data } = resp.data
        if (success) {
          me.$message.success("添加设备到对应的网关成功")
        } else {
          me.$message.error(msg)
        }
      })
    },

    /* 添加网关 */
    confirmAddGateway() {
      const me = this
      const chooseNode = me.$refs.eSelectSiteGatewayTree.getCheckedNodes(true)
      if (chooseNode.length <= 0) {
        me.$message.info("请选择站点")
        return
      }
      const infos = {
        "deviceModel": me.deviceModel,
        "siteIds": chooseNode.map(x => x.siteId),
        "tenantId": me.tenantId
      }
      postItem('/cfgdevice/batchaddgw', infos).then(resp => {
        const { msg, success, data } = resp.data
        if (success) {
          me.$message.success("添加网关")
        } else {
          me.$message.error(msg)
        }
      })
    }

  }
}
</script>

<style scoped>
.e-select-site-gateway-tree__wrapper {
  min-width: 400px;
  text-align: left;
}
.e-select-site-gateway-tree__top {
  padding: 10px;
  /* text-align: right; */
  /* border-bottom: 1px solid #ddd; */
}
.el-tree-node {
  position: relative;
}
.el-tree-node__content:hover .e-select-site-gateway-tree-bar {
  display: block;
}
.e-select-site-gateway-tree-bar {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 12px;
}
.e-select-site-gateway-tree-bar > i {
  margin: 0 5px;
  color: #999;
}
.e-select-site-gateway-tree-bar > i:hover {
  color: #20a0ff;
}

.e-site-info-wrapper{
    height: 100%;
    width: 100%;
    overflow: auto;
    display: flex;
}

.e-site-info-wrapper .info-tree{
    width: 400px;
    max-width: 400px;
    /* border:1px solid red; */
    height: 100%;
    
}
.e-site-info-wrapper .info-detail{
    flex: 1;
    /* border:1px solid green; */
    height: 100%;
}

.e-select-site-gateway-tree .el-tree{
    color:#fff;
    background: transparent;
}


</style>