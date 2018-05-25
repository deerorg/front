<template>
    <div class="bastelestrategy">
    <div class="bastelestrategy__filter-container p-filter-container">
        <span class="p-table-name">监控量存储策略列表</span>
         <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input" @keydown.enter="searchKey">
         </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>

    <section class="bastelestrategy__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据" :data="list" stripe border fit highlight-current-row>
        <el-table-column label="设备类型编号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceTypeName}}</span>
            </template>
        </el-table-column>
        <el-table-column  label="遥测量类型" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.basMeteName4Telemeter}}[{{ scope.row.meteType }}]</span>
            </template>
        </el-table-column>
          <el-table-column  label="站点级别" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.siteLevelName }}</span>
            </template>
        </el-table-column>
          <el-table-column  label="设备状态类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceStatusName }}</span>
            </template>
        </el-table-column>
        <el-table-column  label="是否整点存储" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.saveOnSchedul}}</span>
            </template>
        </el-table-column>
         <el-table-column  label="存储周期" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.spanType}}</span>
            </template>
        </el-table-column>
        <el-table-column  label="变化幅度" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.changeLimit }}</span>
            </template>
        </el-table-column>
        <el-table-column  label="是否存储24H实时值" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.saveRealValue}}</span>
            </template>
        </el-table-column>
        <el-table-column  label="实时存储周期" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.saveRealvalueTime }}</span>
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
        <el-dialog title="修改监控量存储策略信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"   label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="整点存储" prop="saveOnSchedul" >
                    <el-switch v-model="modifyForm.saveOnSchedulToBool" active-text="是"   active-value="1"
                    inactive-value="0"
                    inactive-text="否">
                    </el-switch>
                </el-form-item>
                 <el-form-item label="存储周期" prop="spanType" >
                    <el-select placeholder="请选择存储周期" v-model="modifyForm.spanType">
                        <el-option  v-for="item in spanTypeList" :label="item.span" :value="item.spanType" :key="item.spanType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="存储24小时实时值" prop="saveRealValue" >
                <el-switch
                    v-model="modifyForm.saveRealValue"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="1"
                    inactive-value="0"
                    active-text="是"
                    inactive-text="否">
                    </el-switch>
                </el-form-item>

                <el-form-item label="变化幅度" prop="changeLimit" >
                    <el-input v-model="modifyForm.changeLimit"></el-input>
                </el-form-item>

                <el-form-item label="实时值存储周期" prop="saveRealvalueTime"  v-show="modifyForm.saveRealValue==1">
                    <el-input v-model="modifyForm.saveRealvalueTime" placeholder="请输入实时值存储周期"></el-input>
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
        <el-dialog title="添加监控量存储策略信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"  label-width="200px"   :model="addForm" :rules="rules">
                <el-form-item label="设备类型" prop="deviceType" >
                    <el-select placeholder="请选择所属设备类型" v-model="addForm.deviceType" @change="chooseDeviceType">
                        <el-option  v-for="item in deviceTypeList" :label="item.name" :value="item.deviceType" :key="item.deviceType"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="遥测量类型" prop="meteType" >
                    <!-- <el-select placeholder="请选择所属设备类型" v-model="addForm.deviceType">
                        <el-option  v-for="item in deviceTypeList" :label="item.name" :value="item.deviceType" :key="item.deviceType"></el-option>
                    </el-select> -->
                    <!-- <el-input v-model="addForm.meteType" placeholder="请输入遥测量类型"></el-input> -->
                    <el-select
                            v-model="chooseMeteTypes"
                            multiple
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="loadingMetetypeInfos"
                            :loading="isLoadingCurrentMeteType">
                        <el-option
                            v-for="item in currentChooseMeteTypeList"
                            :key="item.meteType"
                            :label="item.basMeteName"
                            :value="item.meteType">
                            <span style="float: left">{{ item.basMeteName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.meteType }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="站点类型" prop="siteLevel" >
                    <el-select placeholder="请选择站点类型" v-model="addForm.siteLevel">
                        <el-option  v-for="item in siteLevelList" :label="item.name" :value="item.siteLevel" :key="item.siteLevel"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="设备状态" prop="deviceStatus" >
                    <el-select placeholder="请选择设备状态" v-model="addForm.deviceStatus">
                        <el-option  v-for="item in deviceStatusList" :label="item.name" :value="item.deviceStatus" :key="item.deviceStatus"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="整点存储" prop="saveOnSchedul" >
                    <el-switch v-model="addForm.saveOnSchedul" active-text="是"   active-value="1"  inactive-value="0" inactive-text="否">
                    </el-switch>
                </el-form-item>
                 <el-form-item label="存储周期(分钟)" prop="spanType" >
                    <el-select placeholder="请选择存储周期" v-model="addForm.spanType">
                        <el-option  v-for="item in spanTypeList" :label="item.span" :value="item.spanType" :key="item.spanType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="存储24小时实时值" prop="saveRealValue" >
                <el-switch
                    v-model="addForm.saveRealValue"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="1"
                    inactive-value="0"
                    active-text="是"
                    inactive-text="否">
                    </el-switch>
                </el-form-item>

                <el-form-item label="变化幅度" prop="changeLimit" >
                    <el-input v-model="addForm.changeLimit"></el-input>
                </el-form-item>

                <el-form-item label="实时值存储周期" prop="saveRealvalueTime"  v-show="addForm.saveRealValue==1">
                    <el-input v-model="addForm.saveRealvalueTime" placeholder="请输入实时值存储周期"></el-input>
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
import { getAll, addItem, deleteItem, modifyItem, getInfo } from "@/api/advanced"

export default {
  name: "bastelestrategy",
  data() {
    return {
      rawList: [],
      list: [],
      total: 0,
      pageParmas: {
        pageNum: 1,
        pageSize: 20
      },
      // 级别列表
      storeSpanList: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,

      //
      siteLevelList: [],
      deviceTypeList: [],
      deviceStatusList: [],
      spanTypeList: [],

      // 选择设备类型后 过略 metetype
      chooseMeteTypeList: [],
      // 根据关键字过滤后的选择列表
      currentChooseMeteTypeList: [],
      isLoadingCurrentMeteType: false,
      // 选择后的值
      chooseMeteTypes: null,

      modifyForm: {},
      addForm: {},
      modifyFormRules: {
        spanType: [
          {
            required: true,
            message: "监控量存储策略编号1-255",
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
            message: "监控量存储策略编号1-255",
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
      getInfo(`/telestrategy/list?"queryLike=${me.searchName}&pageNum=${me.pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}`)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.list = data.list || []
            me.rawList = data.list || []
            me.total = data.total || 0
            // 获取数据
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

      getAll("/devicestatus/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.deviceStatusList = data
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

      getAll("/storespan/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.spanTypeList = data
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
      deleteItem("/telestrategy/", { spanType: row.spanType }).then(response => {
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
      const currentItem = me.modifyForm

      //   let modifyUrl = `/telestrategy/${currentItem.deviceType}/${currentItem.meteType}/${currentItem.siteLevel}/${currentItem.deviceStatus}`;

      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem('/telestrategy/', me.modifyForm)
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

    confirmAdd() {
      const me = this
      me.addForm.basTeleStrategyKeysList = me.currentChooseMeteTypeList.map(x => {
        return { meteType: x.meteType }
      })

      me.$refs.addForm.validate(valid => {
        if (valid) {
          addItem("/telestrategy/batch", me.addForm)
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
      getInfo("/telemeter/queryby?deviceType=" + deviceType)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.chooseMeteTypeList = data
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    loadingMetetypeInfos(query) {
      const me = this
      if (query !== '') {
        me.isLoadingCurrentMeteType = true
        setTimeout(() => {
          me.isLoadingCurrentMeteType = false
          me.currentChooseMeteTypeList = me.chooseMeteTypeList.filter(item => {
            return item.meteType == query || ('' + item.meteType).indexOf(query) > -1 || item.metetypeName.indexOf(query) > -1
          })
        }, 200)
      } else {
        this.currentChooseMeteTypeList = me.chooseMeteTypeList
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.bastelestrategy {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

