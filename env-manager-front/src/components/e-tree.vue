<template>
<div class="e-tree">
    <div class="e-tree__wrapper">
        <div class="e-tree__tools" v-show="currentData">
            <el-button @click="addInfo" v-show="currentData && currentData.type!='room'" size="mini"  icon="el-icon-plus">添加</el-button>
            <el-button @click="modifyInfo" size="mini"  icon="el-icon-edit">修改</el-button>
            <el-button @click="delInfo" size="mini"  icon="el-icon-delete">删除</el-button>
        </div>
    <div class="e-tree__top">
        <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
        </el-input>

    </div>
      <!--  -->
    <el-tree
      ref="kzTree"
       v-loading="isLoading"
       v-show="isShowTree"
      :data="treeData"
      :props="data.defaultProps"
      :expand-on-click-node="false"
      lazy
      :accordion="true"
      :auto-expand-parent="false"
      node-key="id"
      :default-expand-all="isExpandAll"
      :default-expanded-keys="[0]"
      :highlight-current="true"
      :load="loadTreeNode"
      @node-click="handleNodeClick"
      :render-content="nodeRender"
      :filter-node-method="filterNode"
      class="e-tree">
    </el-tree>
    <!--dialog-->
    <el-dialog :title="addForm.title"  :visible.sync="isShowAddDialog"  :close-on-click-modal="false">
      <el-form :model="addForm" ref="addForm" label-width="200px" :rules="rules" label-position="left" >
          <el-form-item label="添加类型" v-show="addForm.isShowChoose"> 
            <el-radio-group v-model="addForm.type" @change="changeChooseAddType">
                <el-radio label="precinct">下级区域</el-radio>
                <el-radio label="building">楼栋</el-radio>
            </el-radio-group>
          </el-form-item>
        <el-form-item :label="addForm.label" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="p-dialog-footer">
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddInfo">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog  class="e-tree-edit-dialog" :title="modifyform.modifyTitle" :visible.sync="isShowModifyDialog" :close-on-click-modal="false">
      <el-form label-position="left"  :model="modifyform" ref="modifyform"  label-width="200px" :rules="rules" >
        <el-form-item :label="modifyform.label" prop="name">
          <el-input v-model="modifyform.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="p-dialog-footer">
        <el-button @click="isShowModifyDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmModifyInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</div>

</template>


<script>
import { getInfo, addItem, deleteItem, modifyGetItem } from "@/api/advanced"
import { mapGetters } from 'vuex'

export default {
  name: "e-tree",
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return {
          // 默认tree-node的字段名
          defaultProps: {
            children: "children",
            label: "name",
            isLeaf: "leaf"
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['tenantId', 'tenantName'])
  },
  watch: {
    filterText(val) {
      const me = this
      if (val && !me.isExpandAll) {
        me.isExpandAll = true
        me.$refs.kzTree.filter(val)
      } else if (val && me.isExpandAll) {
        me.$refs.kzTree.filter(val)
      } else {
        me.$refs.kzTree.filter(null)
      }
    }
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

      filterText: '',
      isLoading: true,
      isShowTree: false,
      // 默认是false
      isExpandAll: true,

      modifyform: {
        title: "",
        name: "",
        label: "",
        type: ""
      },
      addForm: {
        title: "",
        isShowChoose: false,
        name: "",
        label: "",
        type: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      }
      /* 弹框 */
    }
  },
  mounted() {
    const me = this
    setTimeout(function() {
      Object.keys(me.$refs.kzTree.store.nodesMap).map((key, index) => {
        const node = me.$refs.kzTree.store.nodesMap[key]
        if (node && node.childNodes) {
          node.childNodes.forEach(x => x.expanded = false)
        }
        me.isLoading = false
        me.isShowTree = true
      })
    }, 1000)
  },
  methods: {
    changeChooseAddType(type) {
      const me = this
      if (type == "building") {
        me.addForm.label = "楼栋名称"
      } else {
        me.addForm.label = "区域名称"
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
          `/precinct/current/query?tenantId=${me.tenantId}&precinctId=0`
        ).then(data => {
          const child = data.data.data.map(x => {
            x.name = x.precinctName
            return x
          })
          console.log(child)
          resolve(child)
        })
      } else {
        if (treeItem.data.roomId) {
          // getInfo(
          //     `/room/current?tenantId=${me.tenantId}&floorId=${treeItem.data
          //       .roomId}`
          //   ).then(data => {
          //
          //     let child = data.data.data.map(x => {
          //       x.name = x.roomName;
          //       // x.name = x.buildingName;
          //       return x;
          //     });
          //     console.log(child);
          //     resolve(child);
          //   });
          resolve([])
        } else if (treeItem.data.floorId) {
          getInfo(
            `/floor/current?tenantId=${me.tenantId}&floorId=${treeItem.data
              .floorId}`
          ).then(data => {
            const child = data.data.data.map(x => {
              x.name = x.roomName
              x.leaf = true
              return x
            })
            console.log(child)
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
            console.log(child)
            resolve(child)
          })
        } else if (treeItem.data.precinctId) {
          getInfo(
            `/precinct/current/query?tenantId=${me.tenantId}&precinctId=${treeItem
              .data.precinctId}`
          ).then(data => {
            const child = data.data.data.map(x => {
              x.name = x.precinctName || x.buildingName
              return x
            })
            console.log(child)
            resolve(child)
          })
        } else {
          return resolve([])
        }
        me.$forceUpdate()
      }
      return resolve([])
    },

    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    addInfo() {
      const me = this
      const node = me.$refs.kzTree.getCurrentNode()
      console.log(JSON.stringify(node))
      // 添加类型
      if (node == null || me.currentChooseNode == null) {
        me.$message.info("你还未选择节点")
        return
      }
      me.isShowAddDialog = true
      if (me.currentChooseNode.level == 1) {
        me.addForm = {
          title: "添加顶级区域",
          type: "precinct",
          isShowChoose: false,
          label: "区域名称",
          precinctId: 0,
          precinctName: "",
          name: ""
        }
      } else if (me.currentData.floorId) {
        me.addForm = {
          title: "添加房间",
          isShowChoose: false,
          label: "房间名称",
          name: ""
        }
      } else if (me.currentData.buildingId) {
        me.addForm = {
          title: "添加楼层",
          isShowChoose: false,
          label: "楼层名称",
          name: ""
        }
      } else if (me.currentData.precinctId) {
        me.addForm = {
          title: "添加区域或楼栋",
          isShowChoose: true,
          type: "precinct",
          label: "区域名称",
          precinctId: me.currentData.precinctId,
          name: ""
        }
      } else if (me.currentData.roomName) {
        // 无法添加
        me.isShowAddDialog = false
        me.$message.info("无法添加信息")
      }

      //
      console.log(me.addForm)
    },
    confirmAddInfo() {
      const me = this

      if (me.currentChooseNode.level == 1) {
        const addData = {
          precinctId: 0,
          precinctName: me.addForm.name,
          tenantId: me.tenantId,
          upPrecinctId: 0
        }
        addItem("/precinct/", addData).then(response => {
          if (response && response.data) {
            const { success, msg, data } = response.data
            if (success) {
              me.$message.success("添加成功")
              console.log(me.currentChooseNode)
              addData.name = data.precinctName
              me.currentChooseNode.doCreateChildren([addData])
            } else {
              me.$message.error(msg)
            }
          }
          me.isShowAddDialog = false
        })
      } else if (me.currentData.roomId) {
        // let addData = {
        //     "floorId": me.currentData.floorId,
        //     "roomName": me.addForm.name,
        // }
        // addItem('/room/add',addData).then(response => {
        //     if(response && response.data){
        //         let {success, msg} = response.data;
        //         if(success){
        //             me.$message.success("添加成功");
        //             addData.name = data.roomName;
        //             me.currentChooseNode.doCreateChildren([addData]);
        //         }else{
        //             me.$message.error(msg);
        //         }
        //     }
        //     });
      } else if (me.currentData.floorId) {
        const addData = {
          floorId: me.currentData.floorId,
          roomName: me.addForm.name
        }
        addItem("/room/", addData).then(response => {
          if (response && response.data) {
            const { success, msg } = response.data
            if (success) {
              me.$message.success("添加成功")
              addData.name = me.addForm.name
              me.currentChooseNode.doCreateChildren([addData])
            } else {
              me.$message.error(msg)
            }
          }
          me.isShowAddDialog = false
        })
      } else if (me.currentData.buildingId) {
        const addData = {
          buildingId: me.currentData.buildingId,
          floorName: me.addForm.name
        }
        addItem("/floor/", addData).then(response => {
          if (response && response.data) {
            const { success, msg, data } = response.data
            if (success) {
              me.$message.success("添加成功")
              addData.name = me.addForm.name
              addData.buildingId = data.buildingId
              addData.floorId = data.floorId
              me.currentChooseNode.doCreateChildren([addData])
            } else {
              me.$message.error(msg)
            }
          }
          me.isShowAddDialog = false
        })
      } else if (me.currentData.precinctId || me.currentData.upPrecinctId) {
        let addUrl = ""
        let addData
        if (me.addForm.type == "building") {
          // 添加building
          addData = {
            buildingName: me.addForm.name,
            tenantId: me.tenantId,
            precinctId: me.currentData.precinctId
          }
          addUrl = "/building/"
        } else {
          // 添加子集区域
          addData = {
            tenantId: me.tenantId,
            precinctName: me.addForm.name,
            upPrecinctId: me.currentData.precinctId
          }
          addUrl = "/precinct/"
        }

        addItem(addUrl, addData).then(response => {
          if (response && response.data) {
            const { success, msg, data } = response.data
            if (success) {
              me.$message.success("添加成功")
              addData.name = me.addForm.name
              addData.buildingId = data.buildingId
              addData.precinctId = data.precinctId
              me.currentChooseNode.doCreateChildren([addData])
            } else {
              me.$message.error(msg)
            }
          }
          me.isShowAddDialog = false
        })
      }
    },
    modifyInfo() {
      const me = this
      const node = this.$refs.kzTree.getCurrentNode()
      if (node == null || me.currentChooseNode == null) {
        me.$message.info("您还未选择节点")
        return
      }
      if (me.currentChooseNode != null && me.currentChooseNode.level == 0) {
        me.$message.info("无法修改该节点")
        return
      }
      if (me.currentData.roomId) {
        me.modifyform = {
          modifyTitle: "修改楼室名称",
          label: "楼室名称",
          name: me.currentData.name
        }
      } else if (me.currentData.floorId) {
        me.modifyform = {
          modifyTitle: "修改楼层名称",
          label: "楼层名称",
          name: me.currentData.name
        }
      } else if (me.currentData.buildingId) {
        me.modifyform = {
          modifyTitle: "修改楼栋名称",
          label: "楼栋名称",
          name: me.currentData.name
        }
      } else if (me.currentData.precinctId) {
        me.modifyform = {
          modifyTitle: "修改区域名称",
          label: "区域名称",
          name: me.currentData.name
        }
      }
      me.isShowModifyDialog = true
    },
    confirmModifyInfo() {
      const me = this
      if (me.currentData.roomId) {
        modifyGetItem(
          `/room/rename?roomId=${me.currentData.roomId}&name=${me.modifyform
            .name}`
        ).then(response => {
          if (response && response.data) {
            const { success, msg } = response.data
            if (success) {
              me.$message.success("修改成功")
              me.currentData.name = me.modifyform.name
            } else {
              me.$message.error(msg)
            }
          }
          me.isShowModifyDialog = false
        })
      } else if (me.currentData.floorId) {
        modifyGetItem(
          `/floor/rename?floorId=${me.currentData.floorId}&name=${me.modifyform
            .name}`
        ).then(response => {
          if (response && response.data) {
            const { success, msg } = response.data
            if (success) {
              me.$message.success("修改成功")
              me.currentData.name = me.modifyform.name
            } else {
              me.$message.error(msg)
            }
          }
          me.isShowModifyDialog = false
        })
      } else if (me.currentData.buildingId) {
        modifyGetItem(
          `/building/rename?buildingId=${me.currentData.buildingId}&name=${me
            .modifyform.name}`
        ).then(response => {
          if (response && response.data) {
            const { success, msg } = response.data
            if (success) {
              me.$message.success("修改成功")
              me.currentData.name = me.modifyform.name
            } else {
              me.$message.error(msg)
            }
          }
          me.isShowModifyDialog = false
        })
      } else if (me.currentData.precinctId) {
        modifyGetItem(
          `/precinct/rename?precinctId=${me.currentData.precinctId}&name=${me
            .modifyform.name}`
        ).then(response => {
          if (response && response.data) {
            const { success, msg } = response.data
            if (success) {
              me.$message.success("修改成功")
              me.currentData.name = me.modifyform.name
            } else {
              me.$message.error(msg)
            }
          }
          me.isShowModifyDialog = false
        })
      }
    },

    delInfo() {
      const me = this
      const node = this.$refs.kzTree.getCurrentNode()
      if (!me.currentChooseNode) {
        me.$message.info("请先选择节点")
        return
      }
      if (me.currentChooseNode && me.currentChooseNode.level <= 1) {
        me.$message.info("该节点不能删除")
        return
      } else {
        if (me.currentData.roomId) {
          getInfo(`/room/del?roomId=${me.currentData.roomId}`).then(response => {
            if (response && response.data) {
              const { success, msg } = response.data
              if (success) {
                me.$message.success("删除成功")
                me.currentChooseNode.parent.removeChild(me.currentChooseNode)
              } else {
                me.$message.error(msg)
              }
            }
          })
        } else if (me.currentData.floorId) {
          getInfo(
            `/floor/del?floorId=${me.currentData.floorId}`
          ).then(response => {
            if (response && response.data) {
              const { success, msg } = response.data
              if (success) {
                me.$message.success("删除成功")
                me.currentChooseNode.parent.removeChild(me.currentChooseNode)
              } else {
                me.$message.error(msg)
              }
            }
          })
        } else if (me.currentData.buildingId) {
          getInfo(
            `/building/del?buildingId=${me.currentData.buildingId}`
          ).then(response => {
            if (response && response.data) {
              const { success, msg } = response.data
              if (success) {
                me.$message.success("删除成功")
                me.currentChooseNode.parent.removeChild(me.currentChooseNode)
              } else {
                me.$message.error(msg)
              }
            }
          })
        } else if (me.currentData.precinctId) {
          getInfo(
            `/precinct/del?precinctId=${me.currentData.precinctId}`
          ).then(response => {
            if (response && response.data) {
              const { success, msg } = response.data
              if (success) {
                me.$message.success("删除成功")
                me.currentChooseNode.parent.removeChild(me.currentChooseNode)
              } else {
                me.$message.error(msg)
              }
            }
          })
        }
      }
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
    },
    /* 构建分类title及工具 */
    nodeRender(h, { _self, node, data }) {
      // @todo: 使用jsx插件更好理解

      const type = ["precinct", "building", "floor", "room"]
      if (data.roomId) {
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
                class: "e-tree-bar"
              }
              // [
              //   // 编辑
              //   h("i", {
              //     class: "el-icon-edit",
              //     on: {
              //       click: function(event) {
              //         event.stopPropagation();
              //         typeof _self.treeEdit === "function" &&
              //           _self.treeEdit(data, event, node);
              //       }
              //     }
              //   }),
              //   // 添加
              //   h("i", {
              //     class: "el-icon-plus",
              //     on: {
              //       click: function(event) {
              //         event.stopPropagation();
              //         typeof _self.treeAdd === "function" &&
              //           _self.treeAdd(data, event, node);
              //       }
              //     }
              //   }),
              //   // 删除
              //   h("i", {
              //     class: "el-icon-close",
              //     props: {
              //       "v-popover": "delTreeConfirm"
              //     },
              //     on: {
              //       click: function(event) {
              //         event.stopPropagation();
              //         typeof _self.treeDelete === "function" &&
              //           _self.treeDelete(data, event, node);
              //       }
              //     }
              //   })
              // ]
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
    }
  }
}
</script>

<style scoped>
.e-tree__wrapper {
  min-width: 300px;
  text-align: left;
}
.e-tree__top {
  padding: 10px;
  text-align: right;
  /* border-bottom: 1px solid #ddd;4 */
}
.el-tree-node {
  position: relative;
}
.el-tree-node__content:hover .e-tree-bar {
  display: block;
}
.e-tree-bar {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 12px;
}
.e-tree-bar > i {
  margin: 0 5px;
  color: #999;
}
.e-tree-bar > i:hover {
  color: #20a0ff;
}



</style>