<template>
    <div class="basreporttype">
    <div class="basreporttype__filter-container p-filter-container">
        <span class="p-table-name">遥信量上报类型列表</span>
          <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
          </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="basreporttype__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column
        label="遥信量上报类型编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.reportType }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="遥信量上报类型名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="遥信量上报类型英文名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.nameEn }}</span>
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
        <el-dialog title="修改遥信量上报类型信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"   label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="遥信量上报类型编号" prop="reportType">
                    <el-input v-model="modifyForm.reportType" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="遥信量上报类型名称" prop="name" >
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="遥信量上报类型英文名称" prop="nameEn" >
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
        <el-dialog title="添加遥信量上报类型信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"  label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="遥信量上报类型编号" prop="reportType" >
                     <el-input-number v-model="addForm.reportType" :min="1" :max="255" placeholder="请输入遥信量上报类型编号"></el-input-number>
                </el-form-item>
                <el-form-item label="遥信量上报类型名称" prop="name" >
                    <el-input v-model="addForm.name" placeholder="请输入遥信量上报类型名称"></el-input>
                </el-form-item>
                <el-form-item label="遥信量上报类型英文名称" prop="nameEn" >
                    <el-input v-model="addForm.nameEn" placeholder="请输入遥信量上报类型英文名称"></el-input>
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
const ADD_INIT_FROM = {
  name: "",
  nameEn: "",
  reporttype: ""
}
export default {
  name: "basreporttype",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      reporttypeList: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: ADD_INIT_FROM,
      modifyFormRules: {
        reportType: [{ required: true, message: "遥信量上报类型编号1-255", trigger: "blur", type: 'number' }],
        name: [{ required: true, message: "遥信量上报类型名称", trigger: "blur" }],
        nameEn: [{ required: true, message: "遥信量上报类型英文名称", trigger: "blur" }]
      },
      rules: {
        reportType: [{ required: true, message: "遥信量上报类型编号1-255", trigger: "blur", type: 'number' }],
        name: [
          { required: true, message: "遥信量上报类型名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        nameEn: [{ required: true, message: "遥信量上报类型英文名称", trigger: "blur" }]
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
  },
  methods: {
    getList() {
      const me = this
      getAll("/reporttype/")
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
      deleteItem("/reporttype/", { "reportType": row.reportType }).then(response => {
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
      this.addForm = JSON.parse(JSON.stringify(ADD_INIT_FROM))
      this.isShowAddDialog = true
    },
    confirmModify() {
      const me = this
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem('/reporttype/', me.modifyForm)
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
          addItem('/reporttype/', me.addForm)
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
.basreporttype {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

