<template>
    <div class="cfg-fsu">
    <div class="cfg-fsu__filter-container p-filter-container">
        <span class="p-table-name">网关列表</span>
          <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
          </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>
    <section class="cfg-fsu__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column label="FSU设备编号" align="center">
            <template label="租户名" slot-scope="scope">
                <span>{{ tenantName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="FSU设备编号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.fsuId }}</span>
            </template>
        </el-table-column>
        <el-table-column label="站点" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.siteId }}</span>
            </template>
        </el-table-column>
        <el-table-column label="组网类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.netType }}</span>
            </template>
        </el-table-column>
          <el-table-column label="网元信息" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.netInfo }}</span>
            </template>
        </el-table-column>
        <el-table-column label="接口数" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.portNum }}</span>
            </template>
        </el-table-column>
        <el-table-column label="负责人" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.deviceManager }}</span>
            </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.maintainMobile }}</span>
            </template>
        </el-table-column>
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
        <el-dialog title="修改网关信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"   label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="FSU设备编号" prop="fsuId">
                    <el-input v-model="modifyForm.fsuId" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="站点编号" prop="siteId">
                    <el-input v-model="modifyForm.siteId"></el-input>
                </el-form-item>
                <el-form-item label="请选择组网类型" prop="netType">
                    <el-select placeholder="请选择组网类型" v-model="modifyForm.netType">
                        <el-option  v-for="item in nettypeList" :label="item.name" :value="item.netType" :key="item.netType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="网元信息" prop="netInfo" v-if = "false" >
                    <el-input v-model="modifyForm.netInfo"></el-input>
                </el-form-item>
                <el-form-item label="接口数" prop="portNum" v-if = "false" >
                    <el-input v-model="modifyForm.portNum"></el-input>
                </el-form-item>
                <el-form-item label="设备负责人" prop="deviceManager" >
                    <el-input v-model="modifyForm.deviceManager"></el-input>
                </el-form-item>
                <el-form-item label="维护人电话" prop="maintainMobile" >
                    <el-input v-model="modifyForm.maintainMobile"></el-input>
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
        <el-dialog title="添加网关信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"   label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="FSU设备编号" prop="fsuId">
                    <el-input v-model="addForm.fsuId"></el-input>
                </el-form-item>
                <el-form-item label="站点编号" prop="siteId">
                    <el-input v-model="addForm.siteId"></el-input>
                </el-form-item>
                <el-form-item label="请选择组网类型" prop="netType">
                    <el-select placeholder="请选择组网类型" v-model="addForm.netType">
                        <el-option  v-for="item in nettypeList" :label="item.name" :value="item.netType" :key="item.netType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="网元信息" prop="netInfo"  v-if = "false">
                    <el-input v-model="addForm.netInfo"></el-input>
                </el-form-item>
                <el-form-item label="接口数" prop="portNum" v-if = "false">
                    <el-input v-model="addForm.portNum"></el-input>
                </el-form-item>
                <el-form-item label="设备负责人" prop="deviceManager" >
                    <el-input v-model="addForm.deviceManager"></el-input>
                </el-form-item>
                <el-form-item label="维护人电话" prop="maintainMobile" >
                    <el-input v-model="addForm.maintainMobile"></el-input>
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
  name: "cfg-fsu",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      nettypeList: [],
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {

      },
      rules: {
        fsuId: [{ required: true, message: "fsu设备编号", trigger: "blur", type: 'string' }]
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
      getAll("/cfgfsu/")
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
      getAll("/nettype/").then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.nettypeList = data
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
      deleteItem("/cfgfsu/", { fsuId: row.fsuId }).then(response => {
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
    },
    confirmModify() {
      const me = this
      me.modifyForm.tenantId = me.tenantId
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem('/cfgfsu/', me.modifyForm)
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
          addItem('/cfgfsu/', me.addForm)
            .then(response => {
              const { success, data, msg } = response.data
              me.isShowAddDialog = false
              if (success) {
                me.$message.success("添加成功")
                me.getList()
                me.addForm = JSON.parse(JSON.stringify(ADD_INIT_FROM))
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
.cfg-fsu {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

