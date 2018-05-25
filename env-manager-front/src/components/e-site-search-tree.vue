<template>
<div class="e-site-search-tree">
    <div class="e-site-search-tree__wrapper">
    <div class="e-site-search-tree__top">
    </div>
    <div class="e-site-info-wrapper">
    <div class="info-tree" v-loading="isLoading"   element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(59, 140, 255, 0.6)"   v-show="isShowTree">
        <div class="search-input-wrapper">
            <input
            class="search-input"
            placeholder="请输入关键字"
            v-model="filterText">
        </div>
       
            

        <el-tree
            v-show="isShowTree"
            ref="siteSearchTree"
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="true"
            lazy
            :indent="8"
            node-key="id"
            :default-expand-all="isExpandAll"
            :highlight-current="true"
            :load="loadTreeNode"
            @node-click="handleNodeClick"
            :render-content="nodeRender"
            :filter-node-method="filterNode"
            class="e-site-search-tree__tree">
            </el-tree>
    </div>

    </div> 
  </div>
</div>

</template>


<script>
import { getInfo, addItem, deleteItem, modifyGetItem, modifyItem } from "@/api/advanced"
import { mapGetters } from 'vuex'

import axios from 'axios'

export default {
  name: "e-site-search-tree",
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
    //   tenantName: "租户2",
    //   tenantId: 1,
      currentChooseNode: null,
      currentSelf: null,
      currentData: null,
      treeData: [],
      isShowModifyDialog: false,
      isShowAddDialog: false,

      // 默认tree-node的字段名
      defaultProps: {
        children: "children",
        label: "name"
      },
      siteKindList: [],
      netTypeList: [],
      runTypeList: [],

      // 添加设备的种类
      currentChooseDeviceKind: 1,
      // 对应种类下的deviceModel
      deviceModelList: [],
      // 选择的当前站点的详情信息
      currentSiteDetail: {},

      // 当前站点下的所有设备
      currentSiteDetailDeviceList: [],
      // 当前站点下的网关列表:
      currentSiteFsuList: [],

      // 选择的当前的设备的详细信息
      currentDeviceDetail: {},
      // 修改站点信息
      // tree
      isExpandAll: true,
      // tree filter text
      filterText: '',
      isLoading: true,
      isShowTree: false,
      currentChooseDeviceModel: {}

    }
  },

  mounted() {
    const me = this
    setTimeout(function() {
      me.closedTree()
      me.isLoading = false
      me.isShowTree = true
    }, 1000)
  },
  watch: {
    filterText(val) {
      const me = this
      if (val && !me.isExpandAll) {
        me.isExpandAll = true
        me.$refs.siteSearchTree.filter(val)
      } else if (val && me.isExpandAll) {
        me.$refs.siteSearchTree.filter(val)
        me.isExpandAll = false
      } else {
        me.$refs.siteSearchTree.filter(null)
        me.closedTree()
      }
    }
  },
  methods: {
    // 仅仅显示tree的二级 收缩其他层级
    closedTree() {
      const me = this
      if (me.$refs.siteSearchTree) {
        Object.keys(me.$refs.siteSearchTree.store.nodesMap).map((key, index) => {
          const node = me.$refs.siteSearchTree.store.nodesMap[key]
          if (node && node.childNodes) {
            node.childNodes.forEach(x => x.expanded = false)
          }
        })
      }
    },
    /* 加载子分类 */
    loadTreeNode(treeItem, resolve) {
      // const url = this.data.url.R
      const me = this
      if (treeItem.level === 0) {
        return resolve([{ name: me.tenantName, id: 0 }])
      }
      if (treeItem.level === 1) {
        // 获取该租户下的所有顶级区域
        getInfo(
          `/precinct/site/query?tenantId=${me.tenantId}&precinctId=0`
        ).then(data => {
          const child = data.data.data.map(x => {
            x.name = x.precinctName || x.siteName
            return x
          })
          //   console.log(child);
          resolve(child)
        })
      } else {
        if (treeItem.data.deviceId || treeItem.data.ipcName) {
          resolve([])
        } else if (treeItem.data.roomId) {
          // 获取房间下的站点
          getInfo(
            `/room/site?tenantId=${me.tenantId}&roomId=${treeItem.data
              .roomId}`
          ).then(data => {
            // console.log("获取房间下的站点", data.data);
            const child = data.data.data.map(x => {
              x.name = x.siteName
              return x
            })
            resolve(child)
          })
          // resolve([]);
        } else if (treeItem.data.siteId && treeItem.data.deviceId == null) {
          // 获取站点详情
          // getInfo(
          //   `/cfgsite/queryby?tenantId=${me.tenantId}&siteId=${treeItem.data
          //     .siteId}`
          // ).then(data => {
          //     console.log("站点详情",data.data);
          //     if(data.data.success){
          //         me.currentSite = data.data.data[0];
          //     }
          // });
          // 获取站点设备列表
          // getInfo(
          //   `/cfgdevice/queryby?tenantId=${me.tenantId}&siteId=${treeItem.data
          //     .siteId}`
          // ).then(data => {

          //   let child = data.data.data.map(x => {
          //     x.name = x.deviceName;
          //     return x;
          //   });
          // //   console.log(child);
          //   resolve(child);
          // });
        //   resolve([]);
          const reqUrl1 = `/cfgdevice/queryby?tenantId=${me.tenantId}&siteId=${treeItem.data.siteId}`
          const reqUrl2 = `/ipc/site-ipcs?tenantId=${me.tenantId}&siteId=${treeItem.data.siteId}`
          axios.all([getInfo(reqUrl1), getInfo(reqUrl2)])
            .then(axios.spread(function(resp1, resp2) {
              // 两个请求现在都完成
              if (resp1.data.success && resp2.data.success) {
                const comData = resp1.data.data.concat(resp2.data.data)
                const child = comData.map(x => {
                  x.name = x.deviceName || x.ipcName
                  return x
                })
                resolve(child)
              }
              console.log(resp1, resp2)
            }))
        } else if (treeItem.data.floorId) {
          getInfo(
            `/floor/current?tenantId=${me.tenantId}&floorId=${treeItem.data
              .floorId}`
          ).then(data => {
            const child = data.data.data.map(x => {
              x.name = x.roomName
              //   x.isLeaf = true;
              // x.name = x.buildingName;
              return x
            })
            // console.log(child);
            resolve(child)
          })
        } else if (treeItem.data.buildingId) {
          getInfo(
            `/building/current?tenantId=${me.tenantId}&buildingId=${treeItem
              .data.buildingId}`
          ).then(data => {
            const child = data.data.data.map(x => {
              x.name = x.buildingName || x.floorName
              // x.name = x.buildingName;
              return x
            })
            // console.log(child);
            resolve(child)
          })
        } else if (treeItem.data.precinctId) {
          getInfo(
            `/precinct/site/query?tenantId=${me.tenantId}&precinctId=${treeItem
              .data.precinctId}`
          ).then(data => {
            const child = data.data.data.map(x => {
              x.name = x.precinctName || x.buildingName || x.siteName
              return x
            })
            // console.log(child);
            resolve(child)
          })
        } else {
          return resolve([])
        }
      }
      return resolve([])
    },

    /* 点击响应时间 */
    handleNodeClick(item, node, self) {
      const me = this
      //
      me.currentData = item
      me.currentChooseNode = node
      me.currentSelf = self

      // 删除
      // temp1.node.parent.removeChild(temp1.node)
      me.$emit("node-click", item, node, self)

      if (me.currentData.type == 'site') {
        // 获取站点信息
        getInfo(`/cfgsite/queryby?tenantId=${me.tenantId}&siteId=${me.currentData.siteId}`
        ).then(data => {
          console.log("站点详情", data.data)
          if (data.data.success) {
            me.currentSiteDetail = data.data.data[0]
          }
        })
        // 获取站点下面的所有设备
        getInfo(`/cfgdevice/queryby?tenantId=${me.tenantId}&siteId=${me.currentData.siteId}`).then(data => {
          console.log("该站点下的设备列表", data.data)
          if (data.data.success) {
            me.currentSiteDetailDeviceList = data.data.data || []
            // 当前站点下的网关
            me.currentSiteFsuList = me.currentSiteDetailDeviceList.filter(x => x.deviceKind == 3) || []
          }
        })
      } else if (me.currentData.type == 'device' || me.currentData.type == 'fsu') {
        // 获取设备信息 获取设备列表
        getInfo(`/cfgdevice/queryby?tenantId=${me.tenantId}&siteId=${me.currentData.siteId}&deviceId=${me.currentData.deviceId}`).then(data => {
          console.log("获取设备详情", data.data)
          me.currentDeviceDetail = data.data.data[0]
        })
      } else if (me.currentData.type == 'ipc' && me.currentData.ipcName) {
        // 获取摄像头详情
        getInfo(`/ipc/detail?tenantId=${me.tenantId}&siteId=${me.currentData.siteId}&ipcId=${me.currentData.id}`).then(resp => {
          console.log("获取摄像头详情", resp)
          const { success, msg, data } = resp.data
          if (success) {
            me.currentIpcDetail = data
            // 传递ipc信息给到ipc-index界面
            me.$bus.$emit('on-ipcdata-to-ipc-index', me.currentIpcDetail)
          }
        })
      }
    },
    /* 构建分类title及工具 */
    nodeRender(h, { _self, node, data }) {
      // @todo: 使用jsx插件更好理解
      const type = ["precinct", "building", "floor", "room", "site", "device", "fsu", "ipc"]
      if (data.ipcName) {
        data.type = "ipc"
      } else if (data.fsuId == 0 && data.deviceId) {
        data.type = "fsu"
      } else if (data.deviceId && data.fsuId != 0) {
        data.type = "device"
      } else if (data.siteId) {
        data.type = "site"
      } else if (data.roomId) {
        data.type = "room"
      } else if (data.floorId) {
        data.type = "floor"
      } else if (data.buildingId) {
        data.type = "building"
      } else if (data.precinctId) {
        data.type = "precinct"
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
                class: "e-site-search-tree-bar"
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
    // filter
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  }
}
</script>

<style lang="scss">
.e-site-search-tree{
    &__wrapper {
        min-width: 180px;
        max-width: 240px;
        text-align: left;
        position: fixed;
        top: 72px;
        max-height: 100%;
        width: 100%;
        overflow-x: auto;
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: #fff;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(59, 140, 255, 0.3);
            background-color: #314997;
        }
        &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(59, 140, 255, 0.3);
            border-radius: 10px;
            background-color: #fff;
        }
    }

    &__top {
        padding: 10px;
        text-align: right;
    }

    .e-site-search-tree-bar {
        display: none;
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 12px;
        
    }

    .e-site-search-tree-bar > i {
        margin: 0 5px;
        color: #999;
    }
    .e-site-search-tree-bar > i:hover {
        color: #20a0ff;
    }

    .e-site-info-wrapper{
        height: 100%;
        width: 100%;
        overflow: auto;
        display: flex;
    }

    .e-site-info-wrapper .info-tree{
        width: 300px;
        max-width: 400px;
        /* border:1px solid red; */
        height: 100%;
        
    }
    .e-site-info-wrapper .detail{
        flex: 1;
        height: 100%;
    }

    .el-tree{
        color:#fff;
        background: transparent;
    }


    .e-site-search-tree__tree.el-tree  .el-tree-node__content{
        height: 40px;
        line-height: 40px;
    }

    .search-input-wrapper{
        text-align: center;
        padding:20px 10px;
    
    }

    .search-input{
        background:rgba(246,247,251,0.2);
        border-radius: 20px;
        padding: 0 10px 0 20px;
        color: #fff;
        height: 30px;
        font-size: 16px;
        border: none;
    }
    .search-input::-webkit-input-placeholder { color:#fff; }
    .search-input::-moz-input-placeholder { color:#fff; }
    .search-input::-ms-input-placeholder { color:#fff; }

}
</style>