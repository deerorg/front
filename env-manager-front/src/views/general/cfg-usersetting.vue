<template>
    <div class="cfgusersetting">
    <div class="cfgusersetting__filter-container p-filter-container">
        <span class="p-table-name">用户个性化设置列表</span>
       <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
        </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="cfgusersetting__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column label="租户" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.tentantName }}[{{ scope.row.tentantId }}] </span>
            </template>
        </el-table-column>

        <el-table-column label="登录用户" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.userId }}</span>
            </template>
        </el-table-column>
        <el-table-column
        label="设置类型" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="值" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.value }}</span>
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
        <el-dialog title="修改用户个性化设置信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="设备类型编号" prop="deviceType">
                    <el-input v-model="modifyForm.deviceType" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="设备状态类型编号" prop="deviceStatus" >
                    <el-input v-model="modifyForm.deviceStatus"></el-input>
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
        <el-dialog title="添加用户个性化设置信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"  label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="设备类型编号" prop="deviceType" >
                     <el-input-number v-model="addForm.deviceType" :min="1" :max="255" placeholder="请输入设备类型编号"></el-input-number>
                </el-form-item>
                 <el-form-item label="设备状态类型编号" prop="deviceStatus" >
                     <el-input-number v-model="addForm.deviceStatus" :min="1" :max="255" placeholder="请输入设备状态类型编号"></el-input-number>
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
  name: "cfgusersetting",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      devicestatusmapList: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {
        deviceType: [{ required: true, message: "设备类型编号1-255", trigger: "blur", type: 'number' }],
        deviceStatus: [{ required: true, message: "设备状态类型编号", trigger: "blur", type: 'number' }]
      },
      rules: {
        deviceType: [{ required: true, message: "设备类型编号1-255", trigger: "blur", type: 'number' }],
        deviceStatus: [{ required: true, message: "设备状态类型编号", trigger: "blur", type: 'number' }]
      }
    }
  },
  watch: {
    searchName: function(val, oldVal) {
      if (val) {
        this.list = this.rawList.filter(
          x => x.deviceType.indexOf(val) > -1 || x.deviceStatus.indexOf(val) > -1
        )
      } else {
        this.list = this.rawList
      }
    }
  },

  mounted() {
    const me = this
    me.getList()
  },
  methods: {
    getList() {
      const me = this
      getAll("/devstatusmap/")
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

    handleEdit(index, row) {
      const me = this
      const backdata = JSON.parse(JSON.stringify(row))
      me.modifyForm = backdata
      me.isShowEditDialog = true
    },
    handleDelete(index, row) {
      const me = this
      deleteItem("/devstatusmap/" + row.devicestatusmap).then(response => {
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
      this.isShowAddDialog = true
      this.addForm = {}
    },
    confirmModify() {
      const me = this
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem('/devstatusmap/' + me.modifyForm.devicestatusmap, me.modifyForm)
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
          addItem('/devstatusmap/', me.addForm)
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
.cfgusersetting {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

