<template>
<div class="e-device-model-tree">
    <div class="e-device-model-tree__wrapper">
    <div class="e-device-model-tree__top" v-if="control.isShowOpt">
        <div v-show="currentData && currentData.type == 'root'" >
            <el-button @click="isShowAddDeviceKindDialog=true" size="mini">添加设备种类</el-button>
        </div>
        <div v-show="currentData && currentData.type == 'devicekind'" >
            <el-button @click="removeItem" size="mini">删除设备种类</el-button>
            <el-button @click="isShowAddDeviceTypeDialog=true" size="mini">添加设备类型</el-button>
        </div>
      
        <div v-show="currentData  && currentData.type == 'devicetype'">
            <el-button @click="removeItem" size="mini" >删除设备类型</el-button>
            <el-button @click="addDeviceModel" size="mini">添加设备模型</el-button>
        </div>
          
        <div v-show="currentData  && currentData.type == 'devicemodel'">
            <!-- <el-button @click="modifyDevice">修改设备模板</el-button> -->
            <el-button @click="removeItem" size="mini">删除设备模板</el-button> 
        </div>


    </div>
    <div class="e-device-model-tree__tree">
    <div class="e-device-model-tree__left">
        <el-tree
            ref="deviceModelTree"
            :data="treeData"
            :props="data.defaultProps"
            :expand-on-click-node="true"
            lazy
            :highlight-current="true"
            :load="loadTreeNode"
            @node-click="handleNodeClick"
            :render-content="nodeRender"
            class="e-device-model-tree">
            </el-tree>
    </div>
    <div class="e-device-model-tree__right" v-show="currentData && currentData.type=='devicemodel'"  v-if="control.isShowRight">
        <e-device-template :device-model="currentData"></e-device-template>
    </div>
    </div> 







      <!--  添加设备种类记录 -->
    <section class="layer__dialog">
        <el-dialog title="添加设备种类信息" :visible.sync="isShowAddDeviceKindDialog">
            <el-form ref="addDeviceKindForm" label-position="left"  label-width="200px"  :model="addDeviceKindForm" :rules="addDeviceKindFormRules">
                <el-form-item label="设备种类编号" prop="deviceKind" >
                     <el-input-number v-model="addDeviceKindForm.deviceKind" :min="1" :max="255" placeholder="请输入设备种类编号"></el-input-number>
                </el-form-item>
                <el-form-item label="设备种类名称" prop="kindName" >
                    <el-input v-model="addDeviceKindForm.kindName" placeholder="请输入设备种类名称"></el-input>
                </el-form-item>
                <el-form-item label="设备种类英文名称" prop="kindNameEn" >
                    <el-input v-model="addDeviceKindForm.kindNameEn" placeholder="请输入设备种类英文名称"></el-input>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowAddDeviceKindDialog=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="confirmAddDeviceKind" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>

            </el-form>
        </el-dialog>
    </section>

    <!--  添加设备类型记录 -->
    <section class="layer__dialog">
        <el-dialog title="添加设备类型信息" :visible.sync="isShowAddDeviceTypeDialog">
            <el-form ref="addDeviceTypeForm" label-width="200px" label-position="left"   :model="addDeviceTypeForm" :rules="addDeviceTypeFormRules">
                <el-form-item label="设备类型编号" prop="deviceType" v-if="false">
                    <el-input-number v-model="addDeviceTypeForm.deviceType" placeholder="请输入设备类型编号"></el-input-number>
                </el-form-item>
                <el-form-item label="设备类型名称" prop="name" >
                    <el-input v-model="addDeviceTypeForm.name" placeholder="请输入设备类型名称"></el-input>
                </el-form-item>
                <el-form-item label="设备类型英文名称" prop="nameEn" >
                    <el-input v-model="addDeviceTypeForm.nameEn" placeholder="请输入设备类型英文名称"></el-input>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowAddDeviceTypeDialog=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="confirmAddDeviceType" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>

            </el-form>
        </el-dialog>
    </section>


    <!-- 添加设备模型 -->
    <section class="layer__dialog">
        <el-dialog title="添加系统设备模板信息" :visible.sync="isShowAddModelDialog">
            <el-form ref="addModelForm" label-position="left"   label-width="200px"  :model="addModelForm" :rules="addModelFormRules">
                <el-form-item label="系统设备模板名称" prop="modelName" >
                    <el-input v-model="addModelForm.modelName" placeholder="请输入系统设备模板名称"></el-input>
                </el-form-item>
                <el-form-item label="系统设备模板英文名称" prop="modelNameEn" >
                    <el-input v-model="addModelForm.modelNameEn" placeholder="请输入系统设备模板英文名称"></el-input>
                </el-form-item>
                <el-form-item label="设备厂商编号" prop="manufacturerId" >
                   <el-select placeholder="请选择设备厂商编号" v-model="addModelForm.manufacturerId">
                        <el-option  v-for="item in manufacturerList" :label="item.name" :value="item.manufacturerId" :key="item.manufacturerId"></el-option>
                    </el-select>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowAddDialog=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="confirmAddDeviceModel" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>

            </el-form>
        </el-dialog>
    </section>

    

  </div>
</div>

</template>


<script>
import {
  getInfo,
  addItem,
  deleteItem,
  modifyGetItem,
  modifyItem,
  getAll
} from "@/api/advanced"
import { mapGetters } from "vuex"

import EDeviceTemplate from "@/components/e-device-template"

export default {
  name: "e-device-model-tree",
  components: {
    EDeviceTemplate
  },
  props: {
    data: {
      type: Object,
      required: true,
      default() {
        return {
          // 默认tree-node的字段名
          defaultProps: {
            children: "children",
            label: "name"
          }
        }
      }
    },

    // control 控制信息
    control: {
      type: Object,
      default: () => {
        return {
          isShowOpt: true,
          isShowRight: true
        }
      }
    }
  },
  computed: {},
  data() {
    // 声明保存当前操作分类node对象
    this.__currentNode = null
    return {
      //   tenantName: "租户2",
      //   tenantId: 1,
      currentChooseNode: null,
      currentSelf: null,
      currentData: {},
      treeData: [],
      currentChooseDeviceModel: {},

      // 制造商列表信息
      manufacturerList: [],

      isShowAddDeviceKindDialog: false,
      addDeviceKindForm: {},
      addDeviceKindFormRules: {
        deviceKind: [
          {
            required: true,
            message: "设备种类编号1-255",
            trigger: "blur",
            type: "number"
          }
        ],
        kindName: [
          { required: true, message: "设备种类名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        kindNameEn: [{ required: true, message: "设备种类英文名称", trigger: "blur" }]
      },

      isShowAddDeviceTypeDialog: false,
      addDeviceTypeForm: {},

      addDeviceTypeFormRules: {
        name: [
          { required: true, message: "设备种类名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        nameEn: [{ required: true, message: "设备种类英文名称", trigger: "blur" }]
      },

      isShowAddModelDialog: false,
      addModelForm: {},
      addModelFormRules: {
        modelName: [
          { required: true, message: "设备模型名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        modelNameEn: [{ required: true, message: "设备种类英文名称", trigger: "blur" }]
      }

    }
  },

  mounted() {
    const me = this

    getAll("/manufacturer/")
      .then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.manufacturerList = data
        } else {
          me.$message.error(msg)
        }
      })
      .catch(err => {
        me.$message.error("网络错误")
      })
  },

  methods: {
    /* 加载子分类 */
    loadTreeNode(treeItem, resolve) {
      // const url = this.data.url.R
      const me = this
      if (treeItem.level === 0) {
        return resolve([{ name: "系统设备模板", id: 0 }])
      }
      if (treeItem.level === 1) {
        // 获取系统设备类型
        getInfo("/devicekind/list").then(data => {
          const child = data.data.data.map(x => {
            x.name = x.kindName + "[" + x.deviceKind + "]"
            return x
          })
          resolve(child)
        })
      } else {
        if (treeItem.data.deviceModel) {
          // 获取deviceModel详情
          //  getInfo(
          //   `/room/site?roomId=${treeItem.data
          //     .roomId}`
          // ).then(data => {
          //     console.log("获取房间下的站点", data.data);
          //     let child = data.data.data.map(x => {
          //         x.name = x.siteName;
          //         return x;
          //     });
          //     resolve(child);
          // });
          resolve([])
        } else if (treeItem.data.deviceType && treeItem.data.deviceKind) {
          // 获取设备type下的设备model
          getInfo(
            `/devicemodel/queryby?deviceType=${treeItem.data
              .deviceType}&deviceKind=${treeItem.data.deviceKind}`
          ).then(data => {
            const child = data.data.data.map(x => {
              x.name = x.modelName + "[" + x.deviceModel + "]"
              return x
            })
            console.log(child)
            resolve(child)
          })
        } else if (treeItem.data.deviceKind) {
          // 获取设备种类下的设备类型
          getInfo(
            `/devicetype/queryby?deviceKind=${treeItem.data.deviceKind}`
          ).then(data => {
            const child = data.data.data.map(x => {
              x.name = x.name + "[" + x.deviceType + "]"
              return x
            })
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

      if (me.currentData.type == "devicemodel") {
        // 设备模板详情
        getInfo(
          `/devicemodel/queryby?deviceModel=${me.currentData.deviceModel}`
        ).then(data => {
          console.log("设备模板详情", data.data)
          if (data.data.success) {
            me.currentChooseDeviceModel = data.data.data[0]
            // 发送事件
            // me.$emit('get-current-choose-devicemodel', me.currentChooseDeviceModel)
          }
        })

        // 获取设备模板是否导入协议
        me.handlerModelProtocol(me.currentData.deviceModel)

        // 手动调用ai 请求
        me.$bus.$emit("defalut-request-ai", me.currentData)
      }
    },
    /* 构建分类title及工具 */
    nodeRender(h, { _self, node, data }) {
      // @todo: 使用jsx插件更好理解
      const type = ["devicekind", "devicetype", "devicemodel"]
      if (data.deviceModel) {
        data.type = "devicemodel"
      } else if (data.deviceType) {
        data.type = "devicetype"
      } else if (data.deviceKind) {
        data.type = "devicekind"
      } else {
        data.type = "root"
      }

      const childrenNodes =
        data.id === 0
          ? [h("span", data.name)]
          : [
            h("i", {
              staticClass: "p-tree-icon",
              class: data.type
            }),
            h("span", data.name),
            h("span", {
              class: "e-device-model-tree-bar"
            })
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
    // 添加diviceKind
    confirmAddDeviceKind() {
      const me = this
      me.$refs.addDeviceKindForm.validate(valid => {
        if (valid) {
          addItem("/devicekind/", me.addDeviceKindForm)
            .then(response => {
              me.isShowAddDeviceKindDialog = false
              const { success, data, msg } = response.data
              me.isShowAddDialog = false
              if (success) {
                me.$message.success("添加成功")
                me.addDeviceKindForm.name = me.addDeviceKindForm.kindName + '[' + me.addDeviceKindForm.deviceKind + ']'
                const backAddInfo = JSON.parse(JSON.stringify(me.addDeviceKindForm))
                me.currentChooseNode.doCreateChildren([backAddInfo])
                me.addDeviceKindForm = {}
              } else {
                me.$message.error(msg)
              }
            })
            .catch(err => {
              me.$message.error("网络错误")
            })
        } else {
          me.$message.error("请提交正确的数据")
        }
      })
    },

    // 删除
    removeItem() {
      const me = this
      if (!me.currentData) {
        me.$message.error("请选择要删除的条目")
        return
      }
      const type = me.currentData.type
      if (type == 'devicekind') {
        deleteItem('/devicekind/', { deviceKind: me.currentData.deviceKind }).then(response => {
          if (response && response.data) {
            const { success, msg } = response.data
            if (success) {
              me.$message.success("删除设备种类成功")
              me.currentChooseNode.parent.removeChild(me.currentChooseNode)
            } else {
              me.$message.error(msg)
            }
          }
        })
      } else if (type == 'devicetype') {
        deleteItem('/devicetype/', { deviceType: me.currentData.deviceType }).then(response => {
          if (response && response.data) {
            const { success, msg } = response.data
            if (success) {
              me.$message.success("删除设备成功类型成功")
              me.currentChooseNode.parent.removeChild(me.currentChooseNode)
            } else {
              me.$message.error(msg)
            }
          }
        })
      } else if (type == 'devicemodel') {
        deleteItem('/devicemodel/', { deviceModel: me.currentData.deviceModel }).then(response => {
          if (response && response.data) {
            const { success, msg } = response.data
            if (success) {
              me.$message.success("删除设备模板成功")
              me.currentChooseNode.parent.removeChild(me.currentChooseNode)
            } else {
              me.$message.error(msg)
            }
          }
        })
      }
    },

    // 添加设备 添加diviceType
    confirmAddDeviceType() {
      const me = this
      me.addDeviceTypeForm.deviceKind = me.currentData.deviceKind

      me.$refs.addDeviceTypeForm.validate(valid => {
        if (valid) {
          addItem("/devicetype/", me.addDeviceTypeForm)
            .then(response => {
              me.isShowAddDeviceTypeDialog = false
              const { success, data, msg } = response.data
              me.isShowAddDialog = false
              if (success) {
                me.$message.success("添加成功")
                me.addDeviceTypeForm.deviceType = data.deviceType
                me.addDeviceTypeForm.name = me.addDeviceTypeForm.name + '[' + data.deviceType + ']'
                const backAddInfo = JSON.parse(JSON.stringify(me.addDeviceTypeForm))
                me.currentChooseNode.doCreateChildren([backAddInfo])
                me.addDeviceTypeForm = {}
              } else {
                me.$message.error(msg)
              }
            })
            .catch(err => {
              me.$message.error("网络错误")
            })
        } else {
          me.$message.error("请提交正确的数据")
        }
      })
    },

    // 添加设备model
    addDeviceModel() {
      const me = this
      me.addModelForm = {
        deviceKind: me.currentChooseNode.parent.data.deviceKind,
        deviceType: me.currentData.deviceType,
        manufacturerId: '',
        modelName: '',
        modelNameEn: ''
      }
      me.isShowAddModelDialog = true
    },

    // 确认添加设备模型
    confirmAddDeviceModel() {
      const me = this
      addItem("/devicemodel/", me.addModelForm)
        .then(response => {
          me.isShowAddModelDialog = false
          const { success, data, msg } = response.data
          me.isShowAddDialog = false
          if (success) {
            me.$message.success("添加成功")
            me.addModelForm.deviceModel = data.deviceModel
            me.addModelForm.name = me.addModelForm.modelName + '[' + data.deviceModel + ']'
            const backAddInfo = JSON.parse(JSON.stringify(me.addModelForm))
            me.currentChooseNode.doCreateChildren([backAddInfo])
            me.addModelForm = {}
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    // 模板是否导入协议
    handlerModelProtocol(deviceModel) {
      const me = this
      const currentDeviceModel = deviceModel
      getInfo(`/devicemodel/checkHasProtocol?deviceModel=${currentDeviceModel}`)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            // 发送全局事件 -> e-import-doc
            me.$bus.$emit('get-is-can-use-protocol', data)
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    }
  }
}
</script>

<style scoped>
.e-device-model-tree__wrapper {
  min-width: 300px;
  text-align: left;
}
.e-device-model-tree__top {
  padding: 10px;
  text-align: left;
  /* border-bottom: 1px solid #ddd; */
}
.el-tree-node {
  position: relative;
}
.el-tree-node__content:hover .e-device-model-tree-bar {
  display: block;
}
.e-device-model-tree-bar {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 12px;
}
.e-device-model-tree-bar > i {
  margin: 0 5px;
  color: #999;
}
.e-device-model-tree-bar > i:hover {
  color: #20a0ff;
}

.e-device-model-tree__tree {
  height: 100%;
  width: 100%;
  overflow: auto;
  display: flex;
}














.e-device-model-tree__left {
  width: 300px;
  max-width: 400px;
  height: 100%;
}
.e-device-model-tree__right {
  flex: 1;
  height: 100%;
}

.e-device-model-tree .el-tree {
  color: #fff;
  background: transparent;
}
</style>