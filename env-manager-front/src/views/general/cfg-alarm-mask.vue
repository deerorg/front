<template>
    <div class="cfgalarmmask">
    <div class="cfgalarmmask__filter-container p-filter-container">
        <span class="p-table-name">告警时段屏蔽列表</span>
         <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
         </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="cfgalarmmask__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column label="租户" align="center">
        <template slot-scope="scope">
            <span>{{ tenantName }}[{{tenantId}}]</span>
        </template>
        </el-table-column>
        <el-table-column label="站点" align="center">
        <template slot-scope="scope">
            <span>{{scope.row.siteName}}[{{ scope.row.siteId }}]</span>
        </template>
        </el-table-column>
        <el-table-column label="设备" align="center">
        <template slot-scope="scope">
            <span>{{scope.row.deviceName}}[{{ scope.row.deviceId }}]</span>
        </template>
        </el-table-column>
        <el-table-column label="屏蔽方式" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.maskType }}</span>
        </template>
        </el-table-column>
         <el-table-column label="屏蔽时段" align="center">
        <template slot-scope="scope">
            <span>周日:{{ scope.row.sunday }}</span>
            <span>周一:{{ scope.row.monday }}</span>
            <span>周二:{{ scope.row.tuesday }}</span>
            <span>周三:{{ scope.row.wednesday}}</span>
            <span>周四:{{ scope.row.thurday }}</span>
            <span>周五:{{ scope.row.friday }}</span>
            <span>周六:{{ scope.row.saturday }}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    </section>

    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改告警时段屏蔽信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm">
                <el-form-item label="设备">
                    <el-input v-model="modifyForm.deviceId" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="屏蔽类型" prop="maskType" >
                    <el-select placeholder="请输入屏蔽类型" v-model="modifyForm.maskType">
                        <el-option  v-for="item in maskTypeList" :label="item.name" :value="item.maskType" :key="item.maskType"></el-option>
                    </el-select>
                </el-form-item>
                  
                <el-form-item label="告警时段屏蔽英文名称">
                    <el-input v-model="modifyForm.nameEn"></el-input>
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
        <el-dialog title="添加告警时段屏蔽信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"  label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="站点" prop="siteId" >
                    <el-select placeholder="请选择站点" v-model="addForm.siteId" @change="chooseSite">
                        <el-option  v-for="item in siteList" :label="item.siteName" :value="item.siteId" :key="item.siteId"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="站点下设备" prop="siteId"  v-show="siteDeviceList.siteId">
                    <el-select placeholder="请选择设备" v-model="addForm.deviceId">
                        <el-option  v-for="item in siteDeviceList" :label="item.deviceName" :value="item.deviceId" :key="item.deviceId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="屏蔽类型" prop="maskType" >
                    <el-select placeholder="请选择屏蔽类型" v-model="addForm.maskType">
                        <el-option  v-for="item in maskTypeList" :label="item.name" :value="item.maskType" :key="item.maskType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="告警时段屏蔽名称" prop="name" >
                    <el-input v-model="addForm.name" placeholder="请输入告警时段屏蔽名称"></el-input>
                </el-form-item>
                <el-form-item label="告警时段屏蔽英文名称" prop="nameEn" >
                    <el-input v-model="addForm.nameEn" placeholder="请输入告警时段屏蔽英文名称"></el-input>
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
import { getAll, addItem, deleteItem, modifyItem } from "@/api/advanced"
import { mapGetters } from 'vuex'

export default {
  name: "cfgalarmmask",
  data() {
    return {
      rawList: [],
      list: [],
      // 屏蔽类型列表
      maskTypeList: [],
      // 站点列表
      siteList: [],
      // 站点中设备列表
      siteDeviceList: [],

      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {

      },
      rules: {

      }
    }
  },
  watch: {
    searchName: function(val, oldVal) {
      if (val) {
        this.list = this.rawList.filter(
          x => x.name.indexOf(val) > -1 || x.nameEn.indexOf(val) > -1
        )
      } else {
        this.list = this.rawList
      }
    }
  },
  computed: {
    ...mapGetters(['tenantId', 'tenantName'])
  },
  mounted() {
    const me = this
    me.getList()
    me.getOtherData()
  },
  methods: {
    getList() {
      const me = this
      getAll("/cfgalarmmask/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.list = data
            me.rawList = data
            // 获取数据
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    getOtherData() {
      const me = this
      getAll("/masktype/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.maskTypeList = data
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })

      getAll("/cfgsite/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.siteList = data
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
      deleteItem("/cfgalarmmask/", { siteLevel: row.siteLevel }).then(response => {
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
    chooseSite(currentSite) {
      // 获取设备下的站点
      const me = this
      getInfo(
        `/cfgdevice/queryby?tenantId=${me.tenantId}&siteId=${treeItem.data
          .siteId}`
      ).then(data => {
        if (data.data.success) {
          me.siteDeviceList = data.data.data
        }
      })
    },
    confirmModify() {
      const me = this
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem('/cfgalarmmask/', me.modifyForm)
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
      me.$refs.addForm.validate(valid => {
        if (valid) {
          addItem('/cfgalarmmask/', me.addForm)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.cfgalarmmask {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

