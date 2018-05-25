<template>
    <div class="bassitekind">
    <div class="bassitekind__filter-container p-filter-container">
        <span class="p-table-name">站点类型列表</span>
        <section class="p-input-wrapper">
            <input placeholder="请输入内容" v-model="searchName"  class="p-input">
        </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="bassitekind__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column
        label="站点类型编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.siteKind }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="站点类型名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="站点级别英文名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.nameEn }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="站点级别" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.siteLevelName }}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
        <template slot-scope="scope">
            <el-button
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    </section>

    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改站点类型信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"   label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="站点类型编号" prop="siteKind">
                    <el-input v-model="modifyForm.siteKind" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="站点类型名称" prop="name" >
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="站点类型英文名称" prop="nameEn" >
                    <el-input v-model="modifyForm.nameEn"></el-input>
                </el-form-item>
                <el-form-item label="请选择站点级别" prop="siteLevel">
                    <el-select placeholder="请选择站点级别" v-model="modifyForm.siteLevel">
                       <el-option  v-for="item in siteLevelList" :label="item.name"  :value="item.siteLevel" :key="item.siteLevel"></el-option>
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
        <el-dialog title="添加站点类型信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-width="200px" label-position="left"   :model="addForm" :rules="rules">
                <el-form-item label="站点类型编号" prop="siteKind" >
                     <el-input-number v-model="addForm.siteKind" :min="1" :max="255" placeholder="请输入设备类型编号"></el-input-number>
                </el-form-item>
                <el-form-item label="站点类型名称" prop="name" >
                    <el-input v-model="addForm.name" placeholder="请输入站点类型名称"></el-input>
                </el-form-item>
                <el-form-item label="站点类型英文名称" prop="nameEn" >
                    <el-input v-model="addForm.nameEn" placeholder="请输入站点类型英文名称"></el-input>
                </el-form-item>
                <el-form-item label="请选择站点级别" prop="siteLevel">
                    <el-select placeholder="请选择站点级别" v-model="addForm.siteLevel">
                        <el-option  v-for="item in siteLevelList" :label="item.name" :value="item.siteLevel" :key="item.siteLevel"></el-option>
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
  name: "bassitekind",
  data() {
    return {
      rawList: [],
      list: [],
      // 类型列表
      siteLevelList: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: {
        siteKind: "",
        name: "",
        nameEn: "",
        siteLevel: ""
      },
      modifyFormRules: {
        siteKind: [{ required: true, message: "站点类型编号1-255", trigger: "blur" }],
        name: [{ required: true, message: "站点类型名称", trigger: "blur" }],
        nameEn: [{ required: true, message: "站点类型英文名称", trigger: "blur" }]
      },
      rules: {
        siteKind: [{ required: true, message: "站点类型编号1-255", trigger: "blur" }],
        name: [
          { required: true, message: "站点类型名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" }
        ],
        nameEn: [{ required: true, message: "站点类型英文名称", trigger: "blur" }]
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
  filters: {
    siteLevelFilter: function(value) {
      const me = this
      let result = "未知类型"
      if (me.siteLevelList.length > 0) {
        const item = me.siteLevelList.find(x => x.siteLevel == value)
        if (item) {
          result = item.name
        }
      }
      return result
    }
  },
  mounted() {
    const me = this
    // 获取类列表
    me.initData()
  },
  methods: {
    initData() {
      this.getAllSiteLevel()
    },
    getAllSiteLevel() {
      const me = this
      getAll("/sitelevel/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.siteLevelList = data
            // 获取数据
            me.getList()
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    getList() {
      const me = this
      getAll("/sitekind/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.list = data
            me.rawList = data
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
      deleteItem("/sitekind/", { siteKind: row.siteKind }).then(response => {
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
      modifyItem('/sitekind/', me.modifyForm)
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
    },

    confirmAdd() {
      const me = this
      addItem('/sitekind/', me.addForm)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.bassitekind {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>


