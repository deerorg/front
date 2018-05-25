<template>
    <div class="cfgtelesignal">
    <div class="cfgtelesignal__filter-container p-filter-container">
        <span class="p-table-name">遥信量基本列表</span>
           <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
           </section>
        <span class="p-add-btn" @click="add">
            ✚  查看
        </span>
    </div>


    <section class="cfgtelesignal__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe
        border fit highlight-current-row>
        <el-table-column  label="站点" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.siteName }}[{{scope.row.siteId}}]</span>
        </template>
        </el-table-column>
        <el-table-column label="设备" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.deviceName }}[{{scope.row.deviceId}}]</span>
        </template>
        </el-table-column>
        <el-table-column label="监控量" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.meteName }}[{{scope.row.meteId}}]</span>
        </template>
        </el-table-column>

        <el-table-column label="基本遥调量" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.basMeteId }}</span>
            </template>
        </el-table-column>

        <el-table-column label="监控量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteKind }}</span>
            </template>
        </el-table-column>
        <el-table-column label="遥信量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteType }}-{{ scope.row.metetypeName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="监控量序号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteIndex }}</span>
            </template>
        </el-table-column>
      
        <el-table-column label="遥信量种类" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.signalKind }}</span>
            </template>
        </el-table-column>

        <el-table-column label="有效上限" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.upEffect }}</span>
            </template>
        </el-table-column>

        <el-table-column label="当前值" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.lastValue }}</span>
            </template>
        </el-table-column>
        <el-table-column label="当前值更新时间" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.lastTime }}</span>
            </template>
        </el-table-column>
   
        <el-table-column label="上报模式" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.reportType }}</span>
            </template>
        </el-table-column>
        <el-table-column label="上报级别" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.reportLevel }}</span>
            </template>
        </el-table-column>
         <el-table-column label="屏蔽模式" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.maskType }}</span>
            </template>
        </el-table-column>
         <el-table-column label="告警屏蔽表达式变量串" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.maskMid }}</span>
            </template>
        </el-table-column>
         <el-table-column label="告警屏蔽表达式" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.maskString }}</span>
            </template>
        </el-table-column>
        <el-table-column label="屏蔽值" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.maskValue }}</span>
            </template>
        </el-table-column>
        <el-table-column label="防抖延时门限" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.delayTime }}</span>
            </template>
        </el-table-column>
        <el-table-column label="遥信量解释码" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.explainType }}</span>
            </template>
        </el-table-column>
        <el-table-column label="FSU" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.fsuId}} 通道号:{{ scope.row.basChannelNo }}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="false"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    </section>

    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改遥信量基本信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="遥信量基本名称" prop="basMeteName" >
                    <el-input v-model="modifyForm.basMeteName" readonly ></el-input>
                </el-form-item>
                  <el-form-item label="有效上限" prop="upEffect" >
                    <el-input v-model="modifyForm.upEffect" placeholder="请输入有效上限"></el-input>
                </el-form-item>
                <el-form-item label="遥信量种类" prop="signalKind" >
                    <el-select placeholder="请选择遥信量种类" v-model="modifyForm.signalKind">
                        <el-option  v-for="item in signalkindList" :label="item.name" :value="item.signalKind" :key="item.signalKind"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="上报类型" prop="reportType" >
                       <el-select placeholder="请选择上报类型" v-model="modifyForm.reportType">
                        <el-option  v-for="item in reportTypeList" :label="item.name" :value="item.reportType" :key="item.reportType"></el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="上报级别" prop="reportLevel" >
                    <el-select placeholder="请选择上报级别" v-model="modifyForm.reportLevel">
                        <el-option  v-for="item in reportLevelList" :label="item.levelName" :value="item.reportLevel" :key="item.reportLevel"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="FSU通道号" prop="basChannelNo" >
                    <el-input v-model="modifyForm.basChannelNo" placeholder="请输入FSU通道号"></el-input>
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

    </div>
</template>

<script>
import { getAll, modifyItem } from "@/api/advanced"

export default {
  name: "cfgtelesignal",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      signalkindList: [],
      reportLevelList: [],
      reportTypeList: [],

      searchName: "",
      isShowEditDialog: false,
      modifyForm: {},
      modifyFormRules: {
        signalKind: [{ required: true, message: "遥信量基本编号1-255" }],
        name: [{ required: true, message: "遥信量基本名称", trigger: "blur" }],
        nameEn: [{ required: true, message: "遥信量基本英文名称", trigger: "blur" }]
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
    me.getOthersData()
  },
  methods: {
    getList() {
      const me = this
      getAll("/cfgtelesignal/")
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

      getAll("/signalkind/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.signalkindList = data
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
      getAll("/reportlevel/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.reportLevelList = data
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
      getAll("/reporttype/")
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.reportTypeList = data
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

    // 添加记录
    add() {
      this.$message.info("添加数据通过高级设置->模板管理->监控量模板管理->导入 批量导入添加")
    },
    confirmModify() {
      const me = this
      const currentItem = me.modifyForm
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem('/cfgtelesignal/', me.modifyForm).then(response => {
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
    }

  }
}
</script>
<style lang="scss" scoped>
.cfgtelesignal {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

