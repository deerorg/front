<template>
    <div class="cfgteleconfig">
    <div class="cfgteleconfig__filter-container p-filter-container">
        <span class="p-table-name">配置量基本列表</span>
           <section class="p-input-wrapper">
        <input placeholder="请输入内容" v-model="searchName"  class="p-input">
           </section>
        <span class="p-add-btn" @click="add">
            ✚  查看
        </span>
    </div>

    <section class="cfgteleconfig__table">
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
        <el-table-column label="配置量" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.meteName }}[{{scope.row.meteId}}]</span>
        </template>
        </el-table-column>

        <el-table-column label="基本配置量" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.basMeteId }}</span>
            </template>
        </el-table-column>

        <el-table-column label="配置量类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.meteKind }}</span>
            </template>
        </el-table-column>
       
        <el-table-column label="可控状态" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.controlStatus }}</span>
            </template>
        </el-table-column>

        <el-table-column label="控制使能条件" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.enableString }}</span>
            </template>
        </el-table-column>

        <el-table-column label="控制成功条件" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.succeedString }}</span>
            </template>
        </el-table-column>
        <el-table-column label="触发条件" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.triggerString }}</span>
            </template>
        </el-table-column>

        <el-table-column label="单位" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.unit }}</span>
            </template>
        </el-table-column>

         <el-table-column label="控制参数" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.controlValue }}</span>
            </template>
        </el-table-column>

        <el-table-column label="配置值" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.configValue }}</span>
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
        <el-dialog title="修改配置量基本信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-width="200px" label-position="left"   :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="配置量基本名称" prop="basMeteName" >
                    <el-input v-model="modifyForm.basMeteName" readonly ></el-input>
                </el-form-item>
                  <el-form-item label="控制使能条件" prop="enableString" >
                    <el-input v-model="modifyForm.enableString" placeholder="请输入控制使能条件"></el-input>
                </el-form-item>
                <el-form-item label="控制成功条件" prop="succeedString" >
                    <el-input v-model="modifyForm.succeedString" placeholder="请输入控制成功条件"></el-input>
                </el-form-item>

                <el-form-item label="触发条件" prop="triggerString" >
                    <el-input-number v-model="modifyForm.triggerString" placeholder="触发条件" :min="1" :max="3"></el-input-number>
                </el-form-item>
                <el-form-item label="控制参数" >
                    <el-input v-model="modifyForm.controlValue" placeholder="控制参数" ></el-input>
                </el-form-item>
                <el-form-item label="配置值">
                    <el-input v-model="modifyForm.configValue" placeholder="请输入配置值" :maxlength="8"></el-input>
                </el-form-item>
                <el-form-item label="单位" prop="unit" >
                    <el-input v-model="modifyForm.unit" placeholder="请输入单位" :maxlength="8"></el-input>
                </el-form-item>
                <el-form-item label="FSU通道号" prop="basChannelNo" >
                    <el-input v-model="modifyForm.channelNo" placeholder="请输入FSU通道号"></el-input>
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
  name: "cfgteleconfig",
  data() {
    return {
      rawList: [],
      list: [],
      // 级别列表
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      modifyFormRules: {
        unit: [{ required: true, message: "配置量单位", trigger: "blur" }],
        channelNo: [{ required: true, message: "配置量FSU通道号", trigger: "blur" }]

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
      getAll("/cfgteleadjust/")
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
    // 添加记录
    add() {
      this.$message.info("添加数据通过高级设置->模板管理->监控量模板管理->导入 批量导入添加")
      // this.isShowAddDialog = true;
    },
    confirmModify() {
      const me = this
      // PUT /teleadjust/{basMeteId}/{deviceType}/{meteType}
      const currentItem = me.modifyForm
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          modifyItem('/cfgteleadjust/', me.modifyForm).then(response => {
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
          addItem('/cfgteleadjust/', me.addForm)
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
.cfgteleconfig {
  text-align: center;
  &__filter-container {
  }
  &__table {
    text-align: center;
  }
}
</style>

