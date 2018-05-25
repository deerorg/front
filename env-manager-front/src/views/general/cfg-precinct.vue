<template>
    <div class="cfgprecinct">
    <div class="cfgprecinct__filter-container p-filter-container">
        <span class="p-table-name">辖区列表</span>
          <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
        </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="cfgprecinct__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column label="租户" align="center">
        <template slot-scope="scope">
            <!-- <span>{{ scope.row.tenantId }}</span> -->
            <span>{{tenantName}}</span>
        </template>
        </el-table-column>
        <el-table-column label="辖区编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.precinctId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="辖区名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.precinctName }}</span>
        </template>
        </el-table-column>
        <el-table-column label="上级管理区编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.upPrecinctId }}</span>
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
        <el-dialog title="修改辖区信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"   label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="辖区编号" prop="precinctId">
                    <el-input v-model="modifyForm.precinctId" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="租户编号" prop="tenantId">
                    <el-input v-model="modifyForm.tenantId" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="辖区名称" prop="precinctName" >
                    <el-input v-model="modifyForm.precinctName"></el-input>
                </el-form-item>
                 <el-form-item label="上级管理区" prop="upPrecinctId" >
                    <el-select placeholder="请选择上级管辖区(没有不用选)" v-model="modifyForm.upPrecinctId"  clearable>
                       <el-option  v-for="item in rawList" :label="item.precinctName"  :value="item.precinctId" :key="item.precinctId"></el-option>
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
        <el-dialog title="添加辖区信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"  label-width="200px"  :model="addForm" :rules="rules">
               <el-form-item label="辖区编号" prop="precinctId">
                    <el-input-number v-model="addForm.precinctId"></el-input-number>
                </el-form-item>
                <el-form-item label="辖区名称" prop="precinctName" >
                    <el-input v-model="addForm.precinctName"></el-input>
                </el-form-item>
                <el-form-item label="上级管理区" prop="upPrecinctId" >
                    <el-select placeholder="请选择上级管辖区(没有不用选)" v-model="addForm.upPrecinctId"  clearable>
                       <el-option  v-for="item in rawList" :label="item.precinctName"  :value="item.precinctId" :key="item.precinctId"></el-option>
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
import { mapGetters } from 'vuex'

const ADD_INIT_FROM = {
  precinctId: "",
  tenantId: "1",
  upPrecinctId: 0,
  precinctName: ""
}

export default {
  name: "cfgprecinct",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: ADD_INIT_FROM,
      modifyFormRules: {
        precinctName: [{ required: true, message: "辖区名称", trigger: "blur" }]
      },
      rules: {
        precinctId: [{ required: true, message: "辖区编号1-254", trigger: "blur", type: 'number' }],
        precinctName: [
          { required: true, message: "辖区名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" },
          { max: 20, message: "长度在 20 字符以内", trigger: "blur" }
        ]

      }
    }
  },
  watch: {
    searchName: function(val, oldVal) {
      if (val) {
        this.list = this.rawList.filter(
          x => x.precinctName.indexOf(val) > -1 || ("" + x.precinctId).indexOf(val) > -1
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
  },
  methods: {
    getList() {
      const me = this
      getAll("/cfgprecinct/")
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
      deleteItem("/cfgprecinct/" + row.tenantId + "/" + row.precinctId).then(response => {
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
      const upPrecinctId = me.modifyForm.upPrecinctId
      if (!upPrecinctId) {
        me.modifyForm.upPrecinctId = 0
      }
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem("/cfgprecinct/" + me.modifyForm.tenantId + "/" + me.modifyForm.precinctId, me.modifyForm)
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
          addItem('/cfgprecinct/', me.addForm)
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
.cfgprecinct {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

