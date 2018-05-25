<template>
<div class="e-site-tree">
    <div class="e-site-tree__wrapper">
        <div v-show="currentData && (currentData.type == 'precinct' || currentData.type =='room')" >
            <el-button @click="addSite" size="mini">添加站点</el-button>
        </div>
        <div v-show="currentData  && currentData.type=='site'">
            <el-button @click="modifySite" size="mini"  icon="el-icon-edit">修改站点信息</el-button>
            <el-button @click="delSite" size="mini" icon="el-icon-delete">删除站点</el-button>
            <el-button v-show="currentData && currentData.isTemplet" size="mini" @click="copySite" icon="el-icon-printer">复制站点</el-button>
            <el-button @click="addDevice(1)" size="mini" icon="el-icon-plus">添加动力设备</el-button>
            <el-button @click="addDevice(2)" size="mini"  icon="el-icon-plus">添加环境设备</el-button>
            <el-button @click="addDevice(3)" size="mini"  icon="el-icon-plus">添加网关</el-button>
            <el-button @click="addDevice(4)" size="mini"  icon="el-icon-plus">添加音频设备</el-button>
            <el-button @click="addCam" size="mini"  icon="el-icon-plus">添加摄像头</el-button>
        </div>
        <div v-show="currentData  && currentData.siteId && currentData.deviceId">
            <el-button @click="modifyDevice" icon="el-icon-edit">修改设备信息</el-button>
            <el-button @click="delDevice" icon="el-icon-delete" >删除设备</el-button>
            <el-button @click="copyDevice"  icon="el-icon-plus">批量添加设备</el-button> 
        </div>
    <div class="e-site-tree__top">
    </div>
    <div class="e-site-info-wrapper">
    <div class="info-tree">
        <el-tree
            ref="eSiteTree"
            :data="treeData"
            :props="data.defaultProps"
            :expand-on-click-node="true"
            lazy
            :highlight-current="true"
            :load="loadTreeNode"
            node-key="id"
            :default-expanded-keys="[0]"
            @node-click="handleNodeClick"
            :render-content="nodeRender"
            class="e-site-tree">
            </el-tree>
    </div>
    <div class="info-detail" v-show="currentData && currentData.type=='site'">
        <div>
            <h4>站点信息</h4>
            站点名称:	{{currentSiteDetail.siteName}}<br>	
            站点编号:	{{currentSiteDetail.siteId}}<br>
            站点类型:   {{currentSiteDetail.siteKindName}}<br>
            组网方式:	{{currentSiteDetail.netTypeName}}<br>
            运行状态:   {{currentSiteDetail.runTypeName}}<br>
            是否是模板站点: {{currentSiteDetail.isTemplet | YesNoFilter}}
        </div>
        <div v-show="currentSiteDetailDeviceList.length>0" style="margin-top:24px;">
            <h4>设备列表</h4>
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据" :data="currentSiteDetailDeviceList" stripe
        border fit highlight-current-row>
            <el-table-column label="编号" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.deviceId}}</span>
            </template>
            </el-table-column>
            <el-table-column label="名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceName }}</span>
            </template>
            </el-table-column>
            <el-table-column label="序号" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.deviceIndex}}</span>
            </template>
            </el-table-column>
            <el-table-column label="安装时间" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.launchtime}}</span>
            </template>
            </el-table-column>
        </el-table>
        </div>
    </div>
    <div class="info-detail info-device-detail" v-show="currentData && (currentData.type=='device'  || currentData.type=='fsu')">
        设备名称: {{currentDeviceDetail.deviceName}} <br> 
        设备编号: {{currentDeviceDetail.deviceId}} <br>
        站内编号:	{{currentDeviceDetail.deviceIndex}}	 <br>
        用户设备编号: {{currentDeviceDetail.userDeviceId}} <br>
        <br>
        设备型号: {{currentDeviceDetail.deviceModel}} <br>
        设备种类: {{currentDeviceDetail.deviceKindName}} [{{currentDeviceDetail.deviceKind}}] <br>
        设备类型: {{currentDeviceDetail.deviceTypeName}} [{{currentDeviceDetail.deviceType}}] <br>
        <br>
        厂商设备型号: {{currentDeviceDetail.deviceManufacturertype}} <br>
        厂商: {{currentDeviceDetail.manufacturerName}} [{{currentDeviceDetail.manufacturerId}}]<br>
        安装时间: {{currentDeviceDetail.launchtime}} <br>

        <h4>五遥量</h4>
        <e-tele-tabs :tenant-id="tenantId" :device="currentDeviceDetail" v-if="isShowDeviceTeleDetail"></e-tele-tabs>

    </div>

    <!-- 摄像头信息 -->
    <div class="info-detail info-ipc-detail" v-show="currentData && (currentData.type=='ipc')">
        摄像头: {{currentIpcDetail.ipcName}}  [{{currentIpcDetail.id}}] <br> 
        状态: {{currentIpcDetail.status | IPCStatusFilter}} <br>
        用户名: {{currentIpcDetail.usrName}} <br>
        密码: {{currentIpcDetail.usrPwd}}  <br>
        IP 端口: {{currentIpcDetail.ip}}:{{currentIpcDetail.port}} <br>
        <p>
            <el-button @click="updateIpcInfo">更新配置信息</el-button>
        </p>




    </div>

    </div> 

    <!-- 修改站点信息你 -->
    <el-dialog  class="e-site-tree-edit-dialog" title="修改站点信息" :visible.sync="isShowModifySiteDialog" :close-on-click-modal="false">
      <el-form  label-position="left"   :model="modifySiteForm" ref="modifySiteForm"  label-width="200px" :rules="modifySiteRules">
        <el-form-item label="站点名称" prop="siteName">
          <el-input v-model="modifySiteForm.siteName"></el-input>
        </el-form-item>
        <el-form-item label="用户站点编号" prop="userSiteId">
          <el-input v-model="modifySiteForm.userSiteId"></el-input>
        </el-form-item>

        <el-form-item label="站点类型" prop="siteKind">
            <el-select placeholder="请选择站点类型" v-model="modifySiteForm.siteKind">
                <el-option  v-for="item in siteKindList" :label="item.name" :value="item.siteKind" :key="item.siteKind"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="组网方式" prop="netType">
            <el-select placeholder="请选择组网方式" v-model="modifySiteForm.netType">
                <el-option  v-for="item in netTypeList" :label="item.name" :value="item.netType" :key="item.netType"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="在线运行状态" prop="runType">
            <el-select placeholder="请选择在线运行状态" v-model="modifySiteForm.runType">
                <el-option  v-for="item in runTypeList" :label="item.name" :value="item.runType" :key="item.runType"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
        <div slot="footer" class="p-dialog-footer">
            <el-button @click="isShowModifySiteDialog = false">取 消</el-button>
            <el-button type="primary" @click="confirmModifySite">确 定</el-button>
         </div>
    </el-dialog>

    <!-- 添加站点信息 -->
    <el-dialog  class="e-site-tree-edit-dialog" title="添加站点信息" :visible.sync="isShowAddSiteDialog" :close-on-click-modal="false">
      <el-form  label-position="left"  :model="addSiteForm" ref="addSiteForm"  label-width="200px" :rules="addSiteFormRules">
        <el-form-item label="站点名称" prop="siteName">
          <el-input v-model="addSiteForm.siteName"></el-input>
        </el-form-item>
        <el-form-item label="用户站点编号" prop="userSiteId">
          <el-input v-model="addSiteForm.userSiteId"></el-input>
        </el-form-item>
        <el-form-item label="是否模板站点" prop="isTemplet">
           <el-radio-group v-model="addSiteForm.isTemplet">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
        </el-radio-group>
        </el-form-item>
        <el-form-item label="站点类型" prop="siteKind">
            <el-select placeholder="请选择站点类型" v-model="addSiteForm.siteKind">
                <el-option  v-for="item in siteKindList" :label="item.name" :value="item.siteKind" :key="item.siteKind"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="组网方式" prop="netType">
            <el-select placeholder="请选择组网方式" v-model="addSiteForm.netType">
                <el-option  v-for="item in netTypeList" :label="item.name" :value="item.netType" :key="item.netType"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="在线运行状态" prop="runType">
            <el-select placeholder="请选择在线运行状态" v-model="addSiteForm.runType">
                <el-option  v-for="item in runTypeList" :label="item.name" :value="item.runType" :key="item.runType"></el-option>
            </el-select>
        </el-form-item>

      </el-form>
       <div slot="footer" class="p-dialog-footer">
            <el-button @click="isShowAddSiteDialog = false">取 消</el-button>
            <el-button type="primary" @click="confirmAddSite">确 定</el-button>
        </div>
    
    </el-dialog>

    <!-- 添加设备或网关 -->
    <el-dialog  class="e-site-tree-add-dialog" :title="addDeviceForm.title" :visible.sync="isShowAddDeviceDialog" :close-on-click-modal="false">
      <el-form  label-position="left"   :model="addDeviceForm" ref="addDeviceForm"  label-width="200px" :rules="addDeviceFormRules">
        <el-form-item :label="addDeviceForm.deviceLabel" prop="deviceName">
          <el-input v-model="addDeviceForm.deviceName"></el-input>
        </el-form-item>
        <el-form-item label="用户设备编号" prop="userDeviceId">
          <el-input v-model="addDeviceForm.userDeviceId"></el-input>
        </el-form-item>
        <el-form-item label="站点内设备编号(0-127)" prop="deviceIndex" v-if="false">
          <el-input v-model="addDeviceForm.deviceIndex"></el-input>
        </el-form-item>
        <el-form-item label="设备类型模板" prop="deviceModel">
            <el-select placeholder="请选择站点类型" v-model="addDeviceForm.deviceModel" @change="addDeviceChooseDeviceModel">
                <el-option  v-for="item in deviceModelList" :label="item.modelName" :value="item.deviceModel" :key="item.deviceModel"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-show="currentChooseDeviceModel.deviceTypeName">
            设备模板详情:
            <br>
            设备模板:{{currentChooseDeviceModel.modelName}}[{{currentChooseDeviceModel.deviceModel}}]
            <br>
            设备种类:{{currentChooseDeviceModel.deviceKindName}}[{{currentChooseDeviceModel.deviceKind}}]
            <br>
            设备类型:{{currentChooseDeviceModel.deviceTypeName}}[{{currentChooseDeviceModel.deviceType}}]
            <br>
            厂商信息:{{currentChooseDeviceModel.manufacturerName}}[{{currentChooseDeviceModel.manufacturerId}}]
        </el-form-item>
        <!-- <el-form-item label="组网方式" prop="netType">
            <el-select placeholder="请选择组网方式" v-model="addDeviceForm.netType">
                <el-option  v-for="item in netTypeList" :label="item.name" :value="item.netType" :key="item.netType"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="在线运行状态" prop="runType">
            <el-select placeholder="请选择在线运行状态" v-model="addDeviceForm.runType">
                <el-option  v-for="item in runTypeList" :label="item.name" :value="item.runType" :key="item.runType"></el-option>
            </el-select>
        </el-form-item> -->

        <el-form-item label="网关" prop="fsuId" v-show="addDeviceForm.type != 3" >
            <el-select placeholder="请选择网关" v-model="addDeviceForm.fsuId" v-show="currentSiteFsuList.length>0">
                <el-option  v-for="item in currentSiteFsuList" :label="item.deviceName" :value="item.deviceId" :key="item.deviceId"></el-option>
            </el-select>
            <span v-show="currentSiteFsuList.length <=0">请先添加网关</span>    
        </el-form-item>

      </el-form>
       <el-row type="flex" >
            <el-col class="p-oneline">
                <el-button @click="isShowAddDeviceDialog=false" class="p-cancle-btn">取消</el-button>
                <el-button type="primary" @click="confirmAddDevice" class="p-save-btn">保存</el-button>
            </el-col>
        </el-row>
    </el-dialog>

<!-- 修改设备信息 -->
    <el-dialog  class="e-site-tree-add-dialog" title="修改设备信息" :visible.sync="isShowModifyDeviceDialog" :close-on-click-modal="false">
      <el-form :model="modifyDeviceForm" ref="modifyDeviceForm"  label-width="200px" :rules="modifyDeviceFormRules">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="modifyDeviceForm.deviceName"></el-input>
        </el-form-item>
        <el-form-item label="用户设备编号" prop="userDeviceId">
          <el-input v-model="modifyDeviceForm.userDeviceId"></el-input>
        </el-form-item>
        <el-form-item label="站点内设备编号(0-127)" prop="deviceIndex">
          <el-input v-model="modifyDeviceForm.deviceIndex" readonly ></el-input>
        </el-form-item>
        <el-form-item label="网关编号" prop="fsuId" v-show = "currentChooseDeviceKind==3">
          <el-input v-model="modifyDeviceForm.fsuId" :readonly="currentChooseDeviceKind==3"></el-input>
        </el-form-item>
        <el-form-item label="网关编号" prop="fsuId" v-show = "currentChooseDeviceKind!=3">
           <el-select placeholder="请选择网关" v-model="modifyDeviceForm.fsuId" v-show="currentSiteFsuList.length>0">
                <el-option  v-for="item in currentSiteFsuList" :label="item.deviceName" :value="item.deviceId" :key="item.deviceId"></el-option>
            </el-select>
        </el-form-item>


        <el-form-item v-show="currentChooseDeviceModel.deviceTypeName">
            设备模板详情:
            <br>
            设备模板:{{currentChooseDeviceModel.modelName}}[{{currentChooseDeviceModel.deviceModel}}]
            <br>
            设备种类:{{currentChooseDeviceModel.deviceKindName}}[{{currentChooseDeviceModel.deviceKind}}]
            <br>
            设备类型:{{currentChooseDeviceModel.deviceTypeName}}[{{currentChooseDeviceModel.deviceType}}]
            <br>
            厂商信息:{{currentChooseDeviceModel.manufacturerName}}[{{currentChooseDeviceModel.manufacturerId}}]
        </el-form-item>
        <!-- <el-form-item label="组网方式" prop="netType">
            <el-select placeholder="请选择组网方式" v-model="modifyDeviceForm.netType">
                <el-option  v-for="item in netTypeList" :label="item.name" :value="item.netType" :key="item.netType"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="在线运行状态" prop="runType">
            <el-select placeholder="请选择在线运行状态" v-model="addDeviceForm.runType">
                <el-option  v-for="item in runTypeList" :label="item.name" :value="item.runType" :key="item.runType"></el-option>
            </el-select>
        </el-form-item> -->
      </el-form>
        <el-row type="flex" >
            <el-col class="p-oneline">
                <el-button @click="isShowModifyDeviceDialog=false" class="p-cancle-btn">取消</el-button>
                <el-button type="primary" @click="confirmModifyDevice" class="p-save-btn">保存</el-button>
            </el-col>
        </el-row>
    </el-dialog>

    <!-- 拷贝站点 -->
     <el-dialog  class="e-site-tree-add-dialog" title="拷贝站点请选择区域" :visible.sync="isShowCopySiteDialog" :close-on-click-modal="false">
        <!-- 选择区域或楼室   -->
        <e-select-area-tree v-if="isShowCopySiteDialog" :site="currentData"></e-select-area-tree>

     </el-dialog>

    <!--  添加摄像头 -->
    <section class="layer__dialog">
        <el-dialog title="添加摄像头信息" :visible.sync="isShowAddIpc">
            <el-form ref="addIpcForm" label-position="left"   label-width="200px"  :model="addIpcForm">
                <el-form-item label="名称" prop="ipcName" >
                    <el-input v-model="addIpcForm.ipcName"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="usrName" >
                    <el-input v-model="addIpcForm.usrName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="usrPwd" >
                    <el-input v-model="addIpcForm.usrPwd"></el-input>
                </el-form-item>
                <el-form-item label="ip" prop="ip" >
                    <el-input v-model="addIpcForm.ip"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port" >
                    <el-input v-model="addIpcForm.port"></el-input>
                </el-form-item>
                <el-form-item label="任务ID" prop="taskId" >
                    <el-input v-model="addIpcForm.taskId"></el-input>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowAddIpc=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="confirmAddCam" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>

            </el-form>
        </el-dialog>
    </section>
  </div>
</div>

</template>


<script>
import { getInfo, addItem, deleteItem, modifyGetItem, modifyItem, postItem } from "@/api/advanced"

import axios from 'axios'

import { mapGetters } from 'vuex'

import ESelectAreaTree from '@/components/e-select-area-tree'

import ETeleTabs from '@/components/e-tele-tabs'

export default {
  name: "e-site-tree",
  components: {
    ESelectAreaTree, ETeleTabs
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
    //   tenantName: "租户2",
    //   tenantId: 1,
      currentChooseNode: null,
      currentSelf: null,
      currentData: null,
      treeData: [],
      isShowModifyDialog: false,
      isShowAddDialog: false,

      siteKindList: [],
      netTypeList: [],
      runTypeList: [],

      // 控制是否显示设备五遥情况 点击设备的时候 false  请求设备信息成功的是否设置为true
      isShowDeviceTeleDetail: false,

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
      isShowModifySiteDialog: false,

      modifySiteForm: {},
      modifySiteRules: {
        siteName: [
          { required: true, message: "输入名称1-20个字符", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ]
      },

      // 添加站点
      isShowAddSiteDialog: false,
      addSiteForm: {},
      addSiteFormRules: {
        siteName: [
          { required: true, message: "输入名称1-20个字符", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        siteKind: [{ required: true, message: "请选择站点类型" }]
      },

      // 添加设备
      addDeviceForm: {},
      addDeviceFormRules: {
        deviceName: [
          { required: true, message: "输入名称1-20个字符", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        fsuId: [{ required: true, message: "请选择网关" }]
      },
      isShowAddDeviceDialog: false,
      // 当前选择的设备模板
      currentChooseDeviceModel: {},

      // 修改设备
      isShowModifyDeviceDialog: false,
      modifyDeviceForm: {},
      modifyDeviceFormRules: {
        deviceName: [
          { required: true, message: "输入名称1-20个字符", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ]
      },

      // 拷贝站点
      isShowCopySiteDialog: false,

      // 拷贝设备
      isShowCopyDeviceDialog: false,

      // 添加摄像头
      isShowAddIpc: false,
      addIpcForm: {},
      // 当前站点下的摄像头列表
      currentSiteIpcList: [],

      // 摄像头信息
      currentIpcDetail: {}

    }
  },

  mounted() {
    const me = this
    //    me.getDeviceOtherList();
    me.getSiteOtherList()
  },

  methods: {

    getSiteOtherList() {
      const me = this
      if (me.netTypeList.length > 0) {
        return
      }
      getInfo("/nettype/list").then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.netTypeList = data
        } else {
          me.$message.error(msg)
        }
      })
        .catch(err => {
          me.$message.error("网络错误")
        })

      getInfo("/runtype/list").then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.runTypeList = data
        } else {
          me.$message.error(msg)
        }
      })
        .catch(err => {
          me.$message.error("网络错误")
        })

      getInfo("/cfgsitekind/list").then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.siteKindList = data
        } else {
          me.$message.error(msg)
        }
      })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    // 获取设备模板类型
    getDeviceOtherList() {
      const me = this
      getInfo("/devicemodel/queryby?deviceKind=" + me.currentChooseDeviceKind).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.deviceModelList = data
          if (me.currentDeviceDetail && me.currentDeviceDetail.deviceId) {
            me.currentChooseDeviceModel = me.deviceModelList.find(x => x.deviceModel = me.currentDeviceDetail.deviceModel)
          }
        } else {
          me.$message.error(msg)
        }
      })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },

    // 修改站点
    modifySite() {
      const me = this
      // me.getSiteOtherList();
      //  更新数据
      me.modifySiteForm = JSON.parse(JSON.stringify(me.currentSiteDetail))

      //  me.deviceModelList
      //  显示弹窗
      me.isShowModifySiteDialog = true
    },
    //  确认修改站点
    confirmModifySite() {
      const me = this
      modifyItem(`/cfgsite/`, me.modifySiteForm).then(response => {
        if (response && response.data) {
          const { success, msg } = response.data
          if (success) {
            me.$message.success("修改成功")
            me.currentData.name = me.modifySiteForm.siteName
          } else {
            me.$message.error(msg)
          }
        }
        me.isShowModifySiteDialog = false
      })
    },
    // 添加站点
    addSite() {
      const me = this
      me.addSiteForm = {
        isTemplet: 0
      }
      me.getSiteOtherList()
      me.isShowAddSiteDialog = true
    },

    // 确认添加站点
    confirmAddSite() {
      const me = this
      const addInfo = {
        "netType": me.addSiteForm.netType,
        "precinctId": me.currentData.precinctId,
        "runType": me.addSiteForm.runType,
        "siteKind": me.addSiteForm.siteKind,
        "siteName": me.addSiteForm.siteName,
        "tenantId": me.tenantId,
        "isTemplet": me.addSiteForm.isTemplet,
        "userSiteId": me.addSiteForm.userSiteId
      }
      if (me.currentData.type == 'room') {
        addInfo.roomId = me.currentData.roomId
        addInfo.precinctId = 0
        // addInfo.floorId = me.currentChooseNode.parent.data.floorId;
        // addInfo.buildingId = me.currentChooseNode.parent.parent.data.buildingId;
        // addInfo.precinctId = me.currentChooseNode.parent.parent.parent.data.precinctId;
      }
      addItem("/cfgsite/", addInfo).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          //
          me.$message.success("添加站点成功")
          addInfo.name = data.siteName
          addInfo.siteId = data.siteId
          me.currentChooseNode.doCreateChildren([addInfo])
          me.$refs.addSiteForm.resetFields()
        } else {
          me.$message.error(msg)
        }
        me.isShowAddSiteDialog = false
      })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },

    // 删除站点
    delSite() {
      const me = this
      if (!me.currentData.siteId) {
        me.$message.error("请选择要删除的站点")
        return
      }
      deleteItem('/cfgsite/', { siteId: me.currentData.siteId, tenantId: me.tenantId }).then(response => {
        if (response && response.data) {
          const { success, msg } = response.data
          if (success) {
            me.$message.success("删除站点成功")
            me.currentChooseNode.parent.removeChild(me.currentChooseNode)
          } else {
            me.$message.error(msg)
          }
        }
      })
    },

    // 删除设备
    delDevice() {
      const me = this
      if (!me.currentData.siteId) {
        me.$message.error("请选择要删除的设备或网关")
        return
      }
      deleteItem('/cfgdevice/', { deviceId: me.currentData.deviceId, tenantId: me.tenantId }).then(response => {
        if (response && response.data) {
          const { success, msg } = response.data
          if (success) {
            me.$message.success("删除设备成功")
            me.currentChooseNode.parent.removeChild(me.currentChooseNode)
          } else {
            me.$message.error(msg)
          }
        }
      })
    },
    // 添加设备或网关
    addDevice(type) {
      const me = this
      me.addDeviceForm = {}
      me.currentChooseDeviceModel = {}
      me.isAddDevice = type != 3
      me.currentChooseDeviceKind = type
      me.addDeviceForm.title = me.isAddDevice ? "添加设备" : "添加网关"
      me.addDeviceForm.deviceLabel = me.isAddDevice ? "设备名称" : "网关名称"
      // 添加设备类型
      me.addDeviceForm.type = type
      me.getDeviceOtherList()
      me.isShowAddDeviceDialog = true
    },

    addDeviceChooseDeviceModel(chooseDeviceModel) {
      const me = this
      me.currentChooseDeviceModel = me.deviceModelList.find(x => x.deviceModel == chooseDeviceModel)
    },

    modifyDeviceChooseDeviceModel(chooseDeviceModel) {
      const me = this
    },
    // 确认添加设备
    confirmAddDevice() {
      const me = this
      const addInfo = {
        tenantId: me.tenantId,
        deviceName: me.addDeviceForm.deviceName,
        siteId: me.currentData.siteId,
        deviceIndex: me.addDeviceForm.deviceIndex,
        deviceModel: me.addDeviceForm.deviceModel,
        userDeviceId: me.addDeviceForm.userDeviceId,
        fsuId: me.currentChooseDeviceKind == 3 ? 0 : me.addDeviceForm.fsuId
      }

      addItem("/cfgdevice/", addInfo).then(response => {
        const { success, data, msg } = response.data
        me.isShowAddDeviceDialog = false
        if (success) {
          //
          me.$message.success("添加设备成功")
          addInfo.name = data.deviceName
          addInfo.deviceId = data.deviceId
          addInfo.fsuId = data.fsuId
          me.currentChooseNode.doCreateChildren([addInfo])
          me.$refs.addDeviceForm.resetFields()
          me.currentChooseDeviceModel = {}
        } else {
          me.$message.error(msg)
        }
      })
        .catch(err => {
          me.$message.error("网络错误")
        }

        )
    },

    // 修改设备
    modifyDevice() {
      const me = this
      // 更新设备类型
      me.currentChooseDeviceKind = me.currentDeviceDetail.deviceKind
      //  更新数据
      me.modifyDeviceForm = JSON.parse(JSON.stringify(me.currentDeviceDetail))
      me.getDeviceOtherList()

      //  显示弹窗

      me.isShowModifyDeviceDialog = true
    },

    // 确认修改设备
    confirmModifyDevice() {
      const me = this
      modifyItem(`/cfgdevice/`, me.modifyDeviceForm).then(response => {
        if (response && response.data) {
          const { success, msg } = response.data
          if (success) {
            me.$message.success("修改成功")
            me.currentData.name = me.modifyDeviceForm.siteName
            me.currentChooseDeviceModel = {}
          } else {
            me.$message.error(msg)
          }
        }
        me.isShowModifyDeviceDialog = false
      })
    },

    // 展开root点
    expandedRootNode() {
      const me = this
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          const aa = me.$refs.eSiteTree
          const rootNode = me.$refs.eSiteTree.root.childNodes[0]
          if (rootNode) {
            rootNode.expanded = true
          }
          console.log(aa)
          resolve(aa)
        }, 100)
      })
    },

    // copySite
    copySite() {
      // 复制站点
      const me = this
      me.isShowCopySiteDialog = true
    },
    // 复制设备
    copyDevice() {
      const me = this
      me.isShowCopyDeviceDialog = true
    },
    // addCam
    addCam() {
      const me = this
      me.isShowAddIpc = true
    },
    // 确认添加摄像头
    confirmAddCam() {
      const me = this
      const currentsiteId = me.currentData.siteId
      me.$refs.addIpcForm.validate(valid => {
        if (valid) {
          me.addIpcForm.siteId = currentsiteId
          postItem("/ipc/add", me.addIpcForm)
            .then(response => {
              const { success, data, msg } = response.data
              me.isShowAddDialog = false
              if (success) {
                me.$message.success("添加成功")
                const addInfo = {

                }
                //  addInfo.name = data.deviceName;
                // addInfo.deviceId = data.deviceId;
                // addInfo.fsuId = data.fsuId;
                me.currentChooseNode.doCreateChildren([addInfo])
                me.$refs.addDeviceForm.resetFields()
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
          `/precinct/site/query?tenantId=${me.tenantId}&precinctId=0`
        ).then(data => {
          const child = data.data.data.map(x => {
            x.name = x.precinctName || x.siteName
            return x
          })
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
            console.log("获取房间下的站点", data.data)
            const child = data.data.data.map(x => {
              x.name = x.siteName
              return x
            })
            resolve(child)
          })
          // resolve([]);
        } else if (treeItem.data.siteId && treeItem.data.deviceId == null) {
          // 获取设备和摄像头
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

        //   resolve([]);
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
            `/precinct/site/query?tenantId=${me.tenantId}&precinctId=${treeItem
              .data.precinctId}`
          ).then(data => {
            const child = data.data.data.map(x => {
              x.name = x.precinctName || x.buildingName || x.siteName
              return x
            })
            console.log(child)
            resolve(child)
          })
        } else {
          return resolve([])
        }
      }
      return resolve([])
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
    /* 点击响应时间 */
    handleNodeClick(item, node, self) {
      const me = this
      //
      me.currentData = item
      me.currentChooseNode = node
      me.currentSelf = self

      // 销毁5遥量显示
      me.isShowDeviceTeleDetail = false
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
            // 绑定当前站点是否是模板站点
            me.currentData.isTemplet = me.currentSiteDetail.isTemplet
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

        // 获取站点下的所有摄像头
        getInfo(`/ipc/site-ipcs?tenantId=${me.tenantId}&siteId=${me.currentData.siteId}`).then(data => {
          console.log("该站点下的摄像头列表", data.data)
          if (data.data.success) {
            me.currentSiteIpcList = data.data.data
          }
        })
      } else if (me.currentData.type == 'device' || me.currentData.type == 'fsu') {
        // 获取设备信息 获取设备列表
        getInfo(`/cfgdevice/queryby?tenantId=${me.tenantId}&siteId=${me.currentData.siteId}&deviceId=${me.currentData.deviceId}`).then(data => {
          console.log("获取设备详情", data.data)
          me.currentDeviceDetail = data.data.data[0]
          me.$nextTick(function() {
            // 显示设备五遥量
            me.isShowDeviceTeleDetail = true
          })
        })
      } else if (me.currentData.type == 'ipc') {
        // 获取摄像头信息 todo
        getInfo(`/ipc/detail?tenantId=${me.tenantId}&siteId=${me.currentData.siteId}&ipcId=${me.currentData.id}`).then(resp => {
          console.log("获取摄像头详情", resp)
          const { success, msg, data } = resp.data
          if (success) {
            me.currentIpcDetail = data
          }
        })
      }
    },
    // 更新摄像头厂商信息
    updateIpcInfo() {
      const me = this
      postItem(`/ipc/onvif?tenantId=${me.tenantId}&siteId=${me.currentData.siteId}&ipcId=${me.currentData.id}`, me.currentIpcDetail).then(resp => {
        const { success, msg, data } = resp.data
        if (success) {
          me.$message.success("更新配置成功")
        } else {
          me.$message.error(msg)
        }
      })
    },

    nodeRender(h, { _self, node, data }) {
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
                class: "e-site-tree-bar"
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
    }
  }
}
</script>

<style scoped>
.e-site-tree__wrapper {
  min-width: 400px;
  text-align: left;
}
.e-site-tree__top {
  padding: 10px;
  text-align: right;
  /* border-bottom: 1px solid #ddd; */
}
.el-tree-node {
  position: relative;
}
.el-tree-node__content:hover .e-site-tree-bar {
  display: block;
}
.e-site-tree-bar {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 12px;
}
.e-site-tree-bar > i {
  margin: 0 5px;
  color: #999;
}
.e-site-tree-bar > i:hover {
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

.e-site-tree .el-tree{
    color:#fff;
    background: transparent;
}


</style>