<template>
    <div class="cfgvipmete">
    <div class="cfgvipmete__filter-container p-filter-container">
        <span class="p-table-name">重要监控量列表</span>
          <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
        </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>

    <section class="cfgvipmete__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据" :data="list" stripe border fit highlight-current-row>
        <el-table-column label="设备类型" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.deviceTypeName}}[{{ scope.row.deviceType }}]</span>
            </template>
        </el-table-column>
        <el-table-column  label="监控量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteType }}</span>
            </template>
        </el-table-column>

         <el-table-column label="站点级别" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.siteLevelName}}[{{ scope.row.siteLevel }}]</span>
            </template>
        </el-table-column>
        <el-table-column  label="监控量种类" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.meteKindName}}[{{ scope.row.meteKind }}]</span>
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

    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改重要监控量信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="监控量类型" prop="meteType">
                    <el-input v-model="modifyForm.meteType" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="监控量类型" prop="meteKind" >
                    <el-select placeholder="请选择监控量类型" v-model="modifyForm.meteKind">
                        <el-option  v-for="item in meteKindList" :label="item.kindName" :value="item.meteKind" :key="item.meteKind"></el-option>
                    </el-select>
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
        <el-dialog title="添加重要监控量信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"  label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="监控量" prop="meteType" >
                     <el-input-number v-model="addForm.meteType"  placeholder="请输入重要监控量"></el-input-number>
                </el-form-item>
                <el-form-item label="设备类型" prop="deviceType" >
                    <el-select placeholder="请输入所属设备类型" v-model="addForm.deviceType">
                        <el-option  v-for="item in deviceTypeList" :label="item.name" :value="item.deviceType" :key="item.deviceType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请选择站点级别" prop="siteLevel">
                    <el-select placeholder="请选择站点级别" v-model="addForm.siteLevel">
                        <el-option  v-for="item in siteLevelList" :label="item.name" :value="item.siteLevel" :key="item.siteLevel"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="监控量类型" prop="meteKind" >
                    <el-select placeholder="请选择监控量类型" v-model="addForm.meteKind">
                        <el-option  v-for="item in meteKindList" :label="item.kindName" :value="item.meteKind" :key="item.meteKind"></el-option>
                    </el-select>
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
export default {
  name: "cfgvipmete",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      deviceTypeList: [],
      siteLevelList: [],
      meteKindList: [],

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

  mounted() {
    const me = this
    me.getList()
    me.getOtherData()
  },
  methods: {
    getList() {
      const me = this
      getAll("/cfgvipmete/")
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

      getAll("/cfgsitelevel/")
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

      getAll("/metekind/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.meteKindList = data
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
      deleteItem("/cfgvipmete/", { siteLevel: row.siteLevel, deviceType: row.deviceType, meteType: row.meteType }).then(response => {
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
          modifyItem("/cfgvipmete/", me.modifyForm)
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
          addItem("/cfgvipmete/", me.addForm)
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
.cfgvipmete {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

