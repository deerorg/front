<template>
    <div class="cfgbuilding">
    <div class="cfgbuilding__filter-container p-filter-container">
        <span class="p-table-name">楼栋信息表</span>
         <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
         </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="cfgbuilding__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column label="租户编号" align="center">
        <template slot-scope="scope">
            <!-- <span>{{ scope.row.tenantId }}</span> -->
            <span>{{tenantName}}</span>
        </template>
        </el-table-column>
        <el-table-column label="管辖区编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.precinctId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="楼栋编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.buildingId }}</span>
        </template>
        </el-table-column>
        <el-table-column label="楼栋名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.buildingName}}</span>
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
        <el-dialog title="修改楼栋信息信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-width="200px"  label-position="left"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="楼栋信息编号" prop="buildingId">
                    <el-input v-model="modifyForm.buildingId" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="楼栋信息名称" prop="buildingName" >
                    <el-input v-model="modifyForm.buildingName"></el-input>
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
        <el-dialog title="添加楼栋信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-width="200px" label-position="left"   :model="addForm" :rules="rules">
                <el-form-item label="请选择管辖区" prop="precinctId">
                    <el-select placeholder="请选择管辖区" v-model="addForm.precinctId">
                       <el-option  v-for="item in precinctList" :label="item.precinctName"  :value="item.precinctId" :key="item.precinctId"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="楼栋编号" prop="buildingId" >
                     <el-input-number v-model="addForm.buildingId"  placeholder="请输入楼栋编号"></el-input-number>
                </el-form-item>
                <el-form-item label="楼栋信息名称" prop="buildingName" >
                    <el-input v-model="addForm.buildingName" placeholder="请输入楼栋信息名称"></el-input>
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
  name: "cfgbuilding",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      precinctList: [],

      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {
        buildingName: [{ required: true, message: "请输入楼栋信息名称", trigger: "blur" }]
      },
      rules: {
        buildingName: [
          { required: true, message: "请输入楼栋信息名称", trigger: "blur" },
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
          x => x.buildingName.indexOf(val) > -1
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
    me.getOthersData()
  },
  methods: {
    getList() {
      const me = this
      getAll("/cfgbuilding/")
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
    getOthersData() {
      const me = this
      getAll("/cfgprecinct/").then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.precinctList = data
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
      deleteItem("/cfgbuilding/" + row.siteLevel).then(response => {
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
          modifyItem('/cfgbuilding/' + me.modifyForm.siteLevel, me.modifyForm)
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
          addItem('/cfgbuilding/', me.addForm)
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
.cfgbuilding {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

