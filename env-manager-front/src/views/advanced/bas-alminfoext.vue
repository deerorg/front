<template>
    <div class="basalminfoext">
    <div class="basalminfoext__filter-container p-filter-container">
        <span class="p-table-name">四级告警方案列表</span>
        <section class="p-input-wrapper">
            <input placeholder="请输入内容" v-model="searchName"  class="p-input" @keydown.enter="searchKey">
        </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>

    <section class="basalminfoext__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据" :data="list" stripe border fit highlight-current-row>
        <el-table-column label="网管设备类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceTypeName }}</span>
            </template>
        </el-table-column>
        <el-table-column  label="设备型号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.modelName }}</span>
            </template>
        </el-table-column>
        <el-table-column  label="监控量类型" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.metetypeName}}({{ scope.row.meteType }})</span>
            </template>
        </el-table-column>
          <el-table-column  label="站点级别" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.siteLevelName }}</span>
            </template>
        </el-table-column>
          <el-table-column  label="告警级别" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.reportLevelName }}</span>
            </template>
        </el-table-column>
        <el-table-column  label="一级告警" align="center">
            <template slot-scope="scope">
                <!-- <span>{{ scope.row.upperlimit1Exist }}</span> -->
                <span v-show="scope.row.upperlimit1Exist">上限:{{ scope.row.upperlimit1 }}</span> 
                <!-- <span>{{ scope.row.lowerlimit1Exist }}</span> -->
                <span v-show="scope.row.lowerlimit1Exist ">下限:{{ scope.row.lowerlimit1 }}</span>
            </template>
        </el-table-column>
        <el-table-column  label="二级告警" align="center">
            <template slot-scope="scope">
                <!-- <span>{{ scope.row.upperlimit2Exist }}</span> -->
                <span v-show="scope.row.upperlimit2Exist">上限:{{ scope.row.upperlimit2 }}</span>
                <!-- <span>{{ scope.row.lowerlimit2Exist }}</span> -->
                <span v-show="scope.row.lowerlimit2Exist">下限:{{ scope.row.lowerlimit2 }}</span>
            </template>
        </el-table-column>
        <el-table-column  label="三级告警" align="center">
            <template slot-scope="scope">
                <!-- <span>{{ scope.row.upperlimit3Exist }}</span> -->
                <span v-show="scope.row.upperlimit3Exist">上限:{{ scope.row.upperlimit3}}</span>
                <!-- <span>{{ scope.row.lowerlimit3Exist }}</span> -->
                <span v-show="scope.row.lowerlimit3Exist">下限:{{ scope.row.lowerlimit3 }}</span>
            </template>
        </el-table-column>
        <el-table-column  label="四级告警" align="center">
            <template slot-scope="scope">
                <!-- <span>{{ }}</span> -->
                <span v-show="scope.row.upperlimit4Exist==1">上限:{{ scope.row.upperlimit4 }}</span>
                <!-- <span>{{ scope.row.lowerlimit4Exist }}</span> -->
                <span v-show="scope.row.lowerlimit4Exist">下限:{{ scope.row.lowerlimit4 }}</span>
            </template>
        </el-table-column>
          <el-table-column  label="告警延时" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.delayalarmTime }}</span>
            </template>
        </el-table-column>
          <el-table-column  label="告警消除延时" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.delaycancelalarmTime }}</span>
            </template>
        </el-table-column>
          <el-table-column  label="Delta值" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.delta }}</span>
            </template>
        </el-table-column>

       
        <el-table-column label="操作" align="center">
        <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    </section>

    <section>
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageParmas.pageNum"
        :page-size="pageParmas.pageSize"
        layout="total, prev, pager, next"
        :total="total">
        </el-pagination>
        
   </section>

    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改告警方案信息" :visible.sync="isShowEditDialog">
            <el-form  label-position="left"   ref="modifyForm" label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="站点类型" prop="siteLevel" >
                    <el-select placeholder="请选择站点类型" v-model="modifyForm.siteLevel">
                        <el-option  v-for="item in siteLevelList" :label="item.name" :value="item.siteLevel" :key="item.siteLevel"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="告警级别" prop="reportLevel" >
                    <el-select placeholder="请选择告警级别" v-model="modifyForm.reportLevel">
                        <el-option  v-for="item in reportLevelList" :label="item.levelName" :value="item.reportLevel" :key="item.reportLevel"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="一级告警" >
                    上限 <el-input style="width:240px" v-model="modifyForm.upperlimit1Exist"></el-input>
                    下限 <el-input  style="width:240px"  v-model="modifyForm.lowerlimit1Exist"></el-input>
                </el-form-item>
                <el-form-item label="二级告警" >
                    上限 <el-input  style="width:240px"  v-model="modifyForm.upperlimit2Exist"></el-input>
                    下限 <el-input  style="width:240px"  v-model="modifyForm.lowerlimit2Exist"></el-input>
                </el-form-item>
                   <el-form-item label="三级告警" >
                    上限 <el-input  style="width:240px"  v-model="modifyForm.upperlimit3Exist"></el-input>
                    下限 <el-input   style="width:240px"  v-model="modifyForm.lowerlimit3Exist"></el-input>
                </el-form-item>
                <el-form-item label="四级告警" >
                    上限 <el-input  style="width:240px"  v-model="modifyForm.upperlimit4Exist"></el-input>
                    下限 <el-input  style="width:240px"  v-model="modifyForm.lowerlimit4Exist"></el-input>
                </el-form-item>
                <el-form-item label="告警延时" prop="delayalarmTime" >
                    <el-input v-model="modifyForm.delayalarmTime" placeholder="请输入告警延时(秒)"></el-input>
                </el-form-item>
                <el-form-item label="告警消除延时" prop="delaycancelalarmTime" >
                    <el-input v-model="modifyForm.delayalarmTime" placeholder="请输入告警消除延时(秒)"></el-input>
                </el-form-item>
                <el-form-item label="Delta值" prop="delta" >
                    <el-input v-model="modifyForm.delta" placeholder="请输入Delta值"></el-input>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowEditDialog=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="confirmModify" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>

    </section>

      <!--  新增 记录 -->
    <section class="layer__dialog">
        <el-dialog title="添加告警方案信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"   label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="所属设备类型" prop="deviceType">
                    <el-select placeholder="请选择所属设备类型" v-model="addForm.deviceType"  @change="chooseDeviceType">
                        <el-option  v-for="item in deviceTypeList" :label="item.name" :value="item.deviceType" :key="item.deviceType"></el-option>
                    </el-select>
                </el-form-item>
                <!-- v-show="addForm.deviceType !=null && addForm.deviceType" -->
                <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-if="false" v-show="addForm.deviceType !=null && addForm.deviceType" >
                    <el-tab-pane label="遥测量" name="first">
                        遥测量
                        <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="currentChoose1" @change="handleCheckedCitiesChange1">
                            <el-checkbox v-for="item in chooseMeteList1" :label="item.name" :key="item.meteType">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-tab-pane>
                    <el-tab-pane label="遥信量" name="second">
                        遥信量
                        <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="currentChoose2" @change="handleCheckedCitiesChange2">
                            <el-checkbox v-for="item2 in chooseMeteList2" :label="item2.name" :key="item2.meteType">{{item2.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-tab-pane>
                </el-tabs> -->
                <el-form-item label="监控量类型" prop="siteLevel" v-show="isShowTree1 && isShowTree2" >
                    <el-col :span="10">
                        <el-tree :data="meteTypeList1" show-checkbox   ref="metetypeTree1"  :default-expand-all="true"></el-tree>
                    </el-col>
                    <el-col :span="12">
                        <el-tree :data="meteTypeList2" show-checkbox  ref="metetypeTree2"  :default-expand-all="true"></el-tree>
                    </el-col>
                </el-form-item>
                <el-form-item label="站点类型" prop="siteLevel" >
                    <el-select placeholder="请选择所属设备类型" v-model="addForm.siteLevel">
                        <el-option  v-for="item in siteLevelList" :label="item.name" :value="item.siteLevel" :key="item.siteLevel"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="告警级别" prop="reportLevel" >
                    <el-select placeholder="请选择所属设备类型" v-model="addForm.reportLevel">
                        <el-option  v-for="item in reportLevelList" :label="item.levelName" :value="item.reportLevel" :key="item.reportLevel"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="一级告警" >
                    上限 <el-input style="width:240px" v-model="addForm.upperlimit1"></el-input>
                    下限 <el-input  style="width:240px"  v-model="addForm.lowerlimit1"></el-input>
                </el-form-item>
                <el-form-item label="二级告警" >
                    上限 <el-input  style="width:240px"  v-model="addForm.upperlimit2"></el-input>
                    下限 <el-input  style="width:240px"  v-model="addForm.lowerlimit2"></el-input>
                </el-form-item>
                   <el-form-item label="三级告警" >
                    上限 <el-input  style="width:240px"  v-model="addForm.upperlimit3"></el-input>
                    下限 <el-input   style="width:240px"  v-model="addForm.lowerlimit3"></el-input>
                </el-form-item>
                <el-form-item label="四级告警" >
                    上限 <el-input  style="width:240px"  v-model="addForm.upperlimit4"></el-input>
                    下限 <el-input  style="width:240px"  v-model="addForm.lowerlimit4"></el-input>
                </el-form-item>
                <el-form-item label="告警延时" prop="delayalarmTime" >
                    <el-input v-model="addForm.delayalarmTime" placeholder="请输入告警延时(秒)"></el-input>
                </el-form-item>
                <el-form-item label="告警消除延时" prop="delaycancelalarmTime" >
                    <el-input v-model="addForm.delayalarmTime" placeholder="请输入告警消除延时(秒)"></el-input>
                </el-form-item>
                <el-form-item label="Delta值" prop="delta" >
                    <el-input v-model="addForm.delta" placeholder="请输入Delta值"></el-input>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowAddDialog=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="confirmAdd" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>

            </el-form>
        </el-dialog>
    </section>

    </div>
</template>

<script>
import {
  getAll,
  addItem,
  deleteItem,
  modifyItem,
  getInfo
} from "@/api/advanced"
export default {
  name: "basalminfoext",
  data() {
    return {
      rawList: [],
      list: [],
      total: 0,
      pageParmas: {
        pageNum: 1,
        pageSize: 20
      },
      activeName: "first",
      // 级别列表
      siteLevelList: [],
      deviceTypeList: [],
      deviceModelList: [],
      meteTypeList: [],

      reportLevelList: [],

      isIndeterminate1: "",
      checkAll1: "",
      chooseMeteList1: [],
      currentChoose1: [],

      isShowTree1: false,
      isShowTree2: false,
      currentChooseDeviceType: "",

      isIndeterminate2: "",
      checkAll2: "",
      chooseMeteList2: [],
      currentChoose2: [],

      meteTypeList1: [
        {
          label: "遥信量",
          children: []
        }
      ],
      meteTypeList2: [
        {
          label: "遥测量",
          children: []
        }
      ],

      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {
        spanType: [
          {
            required: true,
            message: "存储周期类型编号1-255",
            trigger: "blur",
            type: "number"
          }
        ],
        span: [{ required: true, message: "存储周期(分钟)", trigger: "blur" }]
      },
      rules: {
        spanType: [
          {
            required: true,
            message: "存储周期类型编号1-255",
            trigger: "blur",
            type: "number"
          }
        ],
        span: [{ required: true, message: "存储周期(分钟)", trigger: "blur" }]
      }
    }
  },
  mounted() {
    const me = this
    me.getList()

    me.getOthersData()
  },
  methods: {
    searchKey() {
      this.getList()
    },
    getList() {
      const me = this
      const url = `/alminfoext/list?queryLike=${me.searchName}&&pageNum=${me
        .pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}`
      getInfo(url)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.list = data.list
            me.total = data.total
            me.rawList = data.list
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },

    handleSizeChange(pageSize) {
      this.pageParmas.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(pageIndex) {
      this.pageParmas.pageNum = pageIndex
      this.getList()
    },
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // },
    // handleCheckAllChange1(val) {
    //   this.chooseMeteList1 = val;
    //   this.isIndeterminate1 = false;
    // },
    // handleCheckedCitiesChange1(value) {
    //   let checkedCount = value.length;
    //   this.checkAll1 = checkedCount === this.chooseMeteList1.length;
    //   this.isIndeterminate1 =
    //     checkedCount > 0 && checkedCount < this.chooseMeteList1.length;
    // },
    // handleCheckAllChange2(val) {
    //   this.chooseMeteList2 = val;
    //   this.isIndeterminate2 = false;
    // },
    // handleCheckedCitiesChange2(value) {
    //   let checkedCount = value.length;
    //   this.checkAll2 = checkedCount === this.chooseMeteList2.length;
    //   this.isIndeterminate2 =
    //     checkedCount > 0 && checkedCount < this.chooseMeteList1.length;
    // },
    // handleCheckChange1(data, checked, indeterminate) {
    //   console.log(data, checked, indeterminate);
    // },
    // handleNodeClick(data, node, self) {
    //   ;
    //   let me = this;
    //   console.log(data, node, self);

    // },
    // loadNode1(node, resolve) {
    //   ;
    //   let me = this;
    //   console.log(node, resolve);
    //   if (node.level === 0) {
    //     return resolve([{ metetypeName: "遥测量" }]);
    //   }
    //   if (me.currentChooseDeviceType && node.level==1) {

    //   }

    // },

    // loadNode2(node, resolve) {
    //   console.log(node, resolve);
    //   if (node.level === 0) {
    //     return resolve([{ metetypeName: "遥信量" }]);
    //   }
    //   //  return resolve(data);
    // },
    // handleCheckChange2(data, checked, indeterminate) {
    //   console.log(data, checked, indeterminate);
    // },
    // handleNodeClick2(data, node, self) {
    //   console.log(data, node, self);
    // },

    getOthersData() {
      const me = this
      getAll("/devicetype/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.deviceTypeList = data
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })

      getAll("/devicemodel/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.deviceModelList = data
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })

      getAll("/reportlevel/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.reportLevelList = data
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })

      getAll("/sitelevel/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.siteLevelList = data
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    handleEdit(index, row) {
      const me = this
      const backdata = JSON.parse(JSON.stringify(row))
      me.modifyForm = backdata
      me.isShowEditDialog = true
    },
    handleDelete(index, row) {
      const me = this
      deleteItem("/alminfoext/" + row.spanType).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.$message.success("删除成功")
          me.getList()
        } else {
          me.$message.error(msg)
        }
      })
      console.log(index, row)
    },
    // 添加记录
    add() {
      this.addForm = {}
      this.isShowAddDialog = true
    },
    confirmModify() {
      const me = this
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem("/alminfoext/", me.modifyForm)
            .then(response => {
              const { success, data, msg } = response.data
              me.isShowEditDialog = false
              if (success) {
                me.$message.success("修改成功")
                me.getList()
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
    handlerChooseMetetype() {
      const chooseNodes1 = me.$refs.metetypeTree1.getCheckedNodes(true)
      const chooseNodes2 = me.$refs.metetypeTree2.getCheckedNodes(true)
      const arr = []
      arr.push(chooseNodes1.map(x => x.meteType))
      arr.push(chooseNodes2.map(x => x.meteType))

      console.log(arr)
      return arr
    },
    confirmAdd() {
      const me = this
      const chooseNodes1 = me.$refs.metetypeTree1.getCheckedNodes(true)
      const chooseNodes2 = me.$refs.metetypeTree2.getCheckedNodes(true)

      const count = chooseNodes1.length + chooseNodes2.length
      if (count <= 0) {
        me.$message.info("请至少选择一个监控量")
        return
      }
      const addData = {
        delayalarmTime: me.addForm.delayalarmTime || 0,
        delaycancelalarmTime: me.addForm.delaycancelalarmTime || 0,
        delta: me.addForm.delta || 0,
        deviceModel: 0,
        deviceType: me.addForm.currentChooseDeviceType,
        iotBasAlminfoextKeys: me.handlerChooseMetetype(),
        lowerlimit1: me.addForm.lowerlimit1,
        lowerlimit1Exist: me.addForm.lowerlimit1 == null ? 1 : 0,
        lowerlimit2: me.addForm.lowerlimit2,
        lowerlimit2Exist: me.addForm.lowerlimit2 == null ? 1 : 0,
        lowerlimit3: me.addForm.lowerlimit3,
        lowerlimit3Exist: me.addForm.lowerlimit3 == null ? 1 : 0,
        lowerlimit4: me.addForm.lowerlimit4,
        lowerlimit4Exist: me.addForm.lowerlimit3 == null ? 1 : 0,
        reportLevel: me.addForm.reportLevel,
        siteLevel: me.addForm.siteLevel,
        upperlimit1: me.addForm.upperlimit1,
        upperlimit1Exist: me.addForm.upperlimit1 == null ? 1 : 0,
        upperlimit2: me.addForm.upperlimit2,
        upperlimit2Exist: me.addForm.upperlimit2 == null ? 1 : 0,
        upperlimit3: me.addForm.upperlimit3,
        upperlimit3Exist: me.addForm.upperlimit3 == null ? 1 : 0,
        upperlimit4: me.addForm.upperlimit4,
        upperlimit4Exist: me.addForm.upperlimit3 == null ? 1 : 0
      }
      me.$refs.addForm.validate(valid => {
        if (valid) {
          addItem("/alminfoext/", me.addForm)
            .then(response => {
              const { success, data, msg } = response.data
              me.isShowAddDialog = false
              if (success) {
                me.$message.success("添加成功")
                me.getList()
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
    // 当前选择的deviceType
    chooseDeviceType(deviceType) {
      const me = this
      me.currentChooseDeviceType = deviceType
      getInfo("/telemeter/queryby/?deviceType=" + me.currentChooseDeviceType)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            console.log(data)
            data.map(x => {
              x.label = x.basMeteName + `[${x.meteType}]`
              return x
            })
            me.meteTypeList1 = [{ label: "遥测量", id: -1, children: data }]
            me.isShowTree1 = true
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })

      getAll(
        "/telesignal//queryby/?signalKind=1&deviceType=" +
          me.currentChooseDeviceType
      )
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            console.log(data)
            data.map(x => {
              x.label = x.basMeteName + `[${x.meteType}]`
              return x
            })
            me.meteTypeList2 = [{ label: "遥信量", id: -1, children: data }]
            me.isShowTree2 = true
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })

      // getAll("/telemeter/queryby?deviceType="+deviceType)
      // .then(response => {
      //   let { success, data, msg } = response.data;
      //   if (success) {
      //     me.chooseMeteTypeList = data;
      //   } else {
      //     me.$message.error(msg);
      //   }
      // })
      // .catch(err => {
      //   me.$message.error("网络错误");
      // });
    }
  }
}
</script>
<style lang="scss" scoped>
.basalminfoext {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>
