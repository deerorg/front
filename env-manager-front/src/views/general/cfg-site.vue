<template>
    <div class="cfgsite">
    <div class="cfgsite__filter-container p-filter-container">
        <span class="p-table-name">站点配置列表</span>
           <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
           </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>


    <section class="cfgsite__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column
        label="站点编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.siteId }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="站点名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.siteName }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="站点类型" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.siteKindName }}[{{ scope.row.siteKind }}]</span>
        </template>
        </el-table-column>
        <el-table-column
        label="管辖区" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.precinctName}}[{{ scope.row.precinctId }}]</span>
        </template>
        </el-table-column>
         <!-- <el-table-column
        label="楼栋" align="center" v-show="false"> 
        <template slot-scope="scope">
            <span>{{ scope.row.buildingName}}[{{ scope.row.buildingId }}]</span>
        </template>
        </el-table-column> -->
         <!-- <el-table-column
        label="楼层" align="center" v-show="false">
        <template slot-scope="scope">
            <span>{{ scope.row.floorName}}[{{ scope.row.floorId }}]</span>
        </template>
        </el-table-column> -->
        <el-table-column
        label="楼室" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.roomName}}[{{ scope.row.roomId }}]</span>
        </template>
        </el-table-column>
         <el-table-column
        label="用户站点编号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.userSiteId}}</span>
        </template>
        </el-table-column>
         <el-table-column
        label="是否是站点模板" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.isTemplet |YesNoFilter}}</span>
        </template>
        </el-table-column>
         <el-table-column
        label="组网类型" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.netTypeName}}[{{ scope.row.netType }}]</span>
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
        <el-dialog title="修改站点配置信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="区域ID" prop="siteKind">
                    <el-input v-model="modifyForm.siteId" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="站点配置名称" prop="siteName" >
                    <el-input v-model="modifyForm.siteName"></el-input>
                </el-form-item>
                <el-form-item label="用户站点编号" prop="userSiteId" >
                    <el-input v-model="modifyForm.userSiteId"></el-input>
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
        <el-dialog title="添加站点配置信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"  label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="区域ID" prop="precinctId" >
                     <el-input-number v-model="addForm.precinctId" placeholder="请输入区域ID"></el-input-number>
                </el-form-item>
                <el-form-item label="楼室ID" prop="roomId" >
                    <el-input v-model="addForm.roomId" placeholder="请输入楼室ID"></el-input>
                </el-form-item>
                <el-form-item label="站点名称" prop="siteName" >
                    <el-input v-model="addForm.siteName" placeholder="请输入站点配置英文名称"></el-input>
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
  name: "cfgsite",
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
      addForm: {},
      modifyFormRules: {
        siteName: [{ required: true, message: "站点配置编号1-255", trigger: "blur" }],
        name: [{ required: true, message: "站点配置名称", trigger: "blur" }],
        nameEn: [{ required: true, message: "站点配置英文名称", trigger: "blur" }]
      },
      rules: {
        siteKind: [{ required: true, message: "站点配置编号1-255", trigger: "blur" }],
        name: [
          { required: true, message: "站点配置名称", trigger: "blur" },
          { min: 1, message: "长度在 1 字符以上", trigger: "blur" }
        ],
        nameEn: [{ required: true, message: "站点配置英文名称", trigger: "blur" }]
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
      getAll("/cfgsitelevel/")
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
      getAll("/cfgsite/")
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
      deleteItem("/cfgsite/", { siteId: row.siteId }).then(response => {
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
      modifyItem('/cfgsite/', me.modifyForm)
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
      addItem('/cfgsite/', me.addForm)
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
.cfgsite {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>


