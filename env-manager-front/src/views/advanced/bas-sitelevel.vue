<template>
    <div class="bassitelevel">
    <div class="bassitelevel__filter-container p-filter-container">
        <span class="p-table-name">站点级别列表</span>
          <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
          </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="bassitelevel__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column
        label="站点级别编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.siteLevel }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="站点级别名称" align="center">
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
        <el-table-column label="操作" align="center">
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button
            size="mini"
            @click="handleManager(scope.$index, scope.row)">管理天数</el-button>
        </template>
        </el-table-column>
    </el-table>
    </section>

    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改站点级别信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="站点级别编号" prop="siteLevel">
                    <el-input v-model="modifyForm.siteLevel" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="站点级别名称" prop="name" >
                    <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="站点级别英文名称" prop="nameEn" >
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
        <el-dialog title="添加站点级别信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-width="200px" label-position="left"   :model="addForm" :rules="rules">
                <el-form-item label="站点级别编号" prop="siteLevel" >
                     <el-input-number v-model="addForm.siteLevel" :min="1" :max="255" placeholder="请输入站点级别编号"></el-input-number>
                </el-form-item>
                <el-form-item label="站点级别名称" prop="name" >
                    <el-input v-model="addForm.name" placeholder="请输入站点级别名称"></el-input>
                </el-form-item>
                <el-form-item label="站点级别英文名称" prop="nameEn" >
                    <el-input v-model="addForm.nameEn" placeholder="请输入站点级别英文名称"></el-input>
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



      <!--  修改天数 -->
    <section class="layer__dialog">
        <el-dialog title="修改视频存储天数" :visible.sync="isShowDayDialog">
            <el-form ref="dayForm" label-width="200px" label-position="left"   :model="dayForm" :rules="rules">
                <el-form-item label="站点级别编号" prop="siteLevel" >
                     <el-input-number v-model="dayForm.siteLevel" :min="1" :max="255" placeholder="请输入站点级别编号"></el-input-number>
                </el-form-item>
                <el-form-item label="站点级别名称" prop="name" >
                    <el-input v-model="dayForm.name" placeholder="请输入站点级别名称" disabled></el-input>
                </el-form-item>
                <el-form-item label="天数" prop="days" >
                    <el-input v-model="dayForm.days" placeholder="请输入站点视频存放天数"></el-input>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowDayDialog=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="confirmModifyDay" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>

            </el-form>
        </el-dialog>
    </section>

    </div>
</template>

<script>
import { getAll, addItem, deleteItem, modifyItem, getInfo } from "@/api/advanced"
const ADD_INIT_FROM = {
  sitelevel: "",
  name: "",
  nameEn: "",
  siteLevel: ""
}
export default {
  name: "bassitelevel",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      siteLevelList: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      isShowDayDialog: false,
      modifyForm: {},
      dayForm: {},
      addForm: ADD_INIT_FROM,
      modifyFormRules: {
        siteLevel: [{ required: true, message: "站点级别编号1-255", trigger: "blur", type: 'number' }],
        name: [{ required: true, message: "站点级别名称", trigger: "blur" }],
        nameEn: [{ required: true, message: "站点级别英文名称", trigger: "blur" }]
      },
      rules: {
        siteLevel: [{ required: true, message: "站点级别编号1-255", trigger: "blur", type: 'number' }],
        name: [
          { required: true, message: "站点级别名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ],
        nameEn: [{ required: true, message: "站点级别英文名称", trigger: "blur" }]
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
      getAll("/sitelevel/")
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
      deleteItem("/sitelevel/", { siteLevel: row.siteLevel }).then(response => {
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
    // 管理视频存储天数
    handleManager(index, row) {
      const me = this
      me.isShowDayDialog = true
      me.dayForm = row
      getInfo("/ipc-task/fetch-store-level?siteLevel=" + row.siteLevel, { siteLevel: row.siteLevel }).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.dayForm.days = data == null ? 0 : data.days
        } else {
          me.$message.error(msg)
        }
      })
    },

    confirmModifyDay() {
      const me = this
      // todo 确认修改视频天数
      const days = me.dayForm.days
      if (parseInt(days) <= 0 || parseInt(days) > 365) {
        me.$message.error("请输入合法的视频存储天数(1-365)")
        return
      }
      getInfo(`/ipc-task/modify-store-days?id=${me.dayForm.siteLevel}&days=${me.dayForm.days}`).then(response => {
        const { success, data, msg } = response.data
        me.isShowDayDialog = false
        if (success) {
          me.$message.success("修改成功")
        } else {
          me.$message.error(msg)
        }
      })
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
          modifyItem('/sitelevel/', me.modifyForm)
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
          addItem('/sitelevel/', me.addForm)
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
.bassitelevel {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

