<template>
  <div class="ipcindex">
       <div class="ipcindex-container p-filter-container">
        <span class="p-table-name">摄像头列表</span>
        <section class="p-input-wrapper">
            <input placeholder="请输入内容" v-model="searchName"  class="p-input">
        </section>
        <span class="p-add-btn" @click="add">
            ✚  添加
        </span>
    </div>
    
    <section class="ipcindex__table">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据" :data="list" stripe border fit highlight-current-row>
        <el-table-column label="编号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.ipcName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="站点" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.siteName }}[{{scope.row.siteId}}]</span>
            </template>
        </el-table-column>
        
        <el-table-column  label="IP:端口" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.ip }}:{{scope.row.port}}</span>
            </template>
        </el-table-column>
        <el-table-column  label="用户名" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.usrName }}</span>
            </template>
        </el-table-column>
         <el-table-column  label="密码" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.usrPwd }}</span>
            </template>
        </el-table-column>
         <el-table-column  label="任务" align="center" v-if="false">
            <template slot-scope="scope">
                <span>{{ scope.row.taskName }}[{{ scope.row.taskId }}]</span>
            </template>
        </el-table-column>
        <el-table-column  label="状态" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.status | IPCStatusFilter}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
        <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="danger"  @click="handleFont(scope.$index, scope.row)">设置字体</el-button>
            <el-button size="mini"  @click="handlePos(scope.$index, scope.row)" v-if="false">预置位管理</el-button>
        </template>
        </el-table-column>
    </el-table>
    </section>

    <section>
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageParmas.pageNum"
        :page-size="pageParmas.pageSize"
        layout="total, prev, pager, next"
        :total="total">
        </el-pagination>
        
   </section>


    <!--  修改记录 -->
    <section class="layer__dialog">
        <el-dialog title="修改摄像头信息" :visible.sync="isShowEditDialog">
            <el-form ref="modifyForm" label-position="left"  label-width="200px"  :model="modifyForm" :rules="modifyFormRules">
                <el-form-item label="编号" prop="id">
                    <el-input v-model="modifyForm.id" readonly disabled></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="ipcName">
                    <el-input v-model="modifyForm.ipcName"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="usrName" >
                    <el-input v-model="modifyForm.usrName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="usrPwd" >
                    <el-input v-model="modifyForm.usrPwd"></el-input>
                </el-form-item>
                <el-form-item label="ip" prop="ip" >
                    <el-input v-model="modifyForm.ip"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port" >
                    <el-input v-model="modifyForm.port"></el-input>
                </el-form-item>
                <el-form-item label="站点" prop="siteId" >
                    <el-select placeholder="请选择站点" v-model="modifyForm.siteId">
                        <el-option  v-for="item in currentSiteList" :label="item.siteName" :value="item.siteId" :key="item.siteId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务" prop="taskId" >
                    <el-select placeholder="请选择任务" v-model="modifyForm.taskId">
                        <el-option  v-for="item in currentTaskList" :label="item.name" :value="item.id" :key="item.id"></el-option>
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
        <el-dialog title="添加摄像头信息" :visible.sync="isShowAddDialog">
            <el-form ref="addForm" label-position="left"   label-width="200px"  :model="addForm" :rules="rules">
                <el-form-item label="名称" prop="ipcName" >
                    <el-input v-model="addForm.ipcName"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="usrName" >
                    <el-input v-model="addForm.usrName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="usrPwd" >
                    <el-input v-model="addForm.usrPwd"></el-input>
                </el-form-item>
                <el-form-item label="ip" prop="ip" >
                    <el-input v-model="addForm.ip"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port" >
                    <el-input v-model="addForm.port"></el-input>
                </el-form-item>
                <el-form-item label="站点" prop="siteId" >
                    <el-select placeholder="请选择站点" v-model="addForm.siteId">
                        <el-option  v-for="item in currentSiteList" :label="item.siteName" :value="item.siteId" :key="item.siteId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务" prop="taskId" >
                     <el-select placeholder="请选择任务" v-model="addForm.taskId">
                        <el-option  v-for="item in currentTaskList" :label="item.name" :value="item.id" :key="item.id"></el-option>
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


    <el-dialog title="预置位管理" :visible.sync="isShowPosDialog">
       <pos :ipc-id="currentPicId" v-if="isShowPosDialog"></pos>
    </el-dialog>

    <el-dialog title="显示管理" :visible.sync="isShowFontDialog">
        <el-form ref="displayForm" label-position="left"   label-width="200px"  :model="displayForm">
                <el-form-item label="文字" prop="plainText" >
                    <el-input v-model="displayForm.plainText"></el-input>
                </el-form-item>
                <el-form-item label="字体大小" prop="fontSize" >
                    <el-input v-model="displayForm.fontSize"></el-input>
                </el-form-item>
                <el-form-item label="颜色" prop="wordColor" >
                    <el-color-picker v-model="displayForm.wordColor" show-alpha></el-color-picker>
                </el-form-item>
                <el-row type="flex" >
                    <el-col class="p-oneline">
                        <el-button @click="isShowFontDialog=false" class="p-cancle-btn">取消</el-button>
                        <el-button type="primary" @click="saveDisplay" class="p-save-btn">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
    </el-dialog>



  </div>
</template>

<script>
import { getInfo, postItem } from '@/api/advanced'
import { mapGetters } from 'vuex'

import Pos from './pos'
export default {
  name: 'ipcindex',
  components: {
    Pos
  },

  data() {
    return {
      rawList: [],
      list: [],
      total: 0,
      pageParmas: {
        pageNum: 1,
        pageSize: 20
      },
      searchName: "",
      isShowAddDialog: false,
      isShowEditDialog: false,
      modifyForm: {},
      addForm: {},
      modifyFormRules: {},
      rules: {},
      // 当前租户的站点列表
      currentSiteList: [],
      // 任务
      currentTaskList: [],
      // 预置位
      posList: [],
      // 当前picId
      currentPicId: '',
      isShowPosDialog: false,

      // 当前的字体
      isShowFontDialog: false,
      displayForm: {}
      // save display

    }
  },
  computed: {
    ...mapGetters(['tenantId'])
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
    me.getOtherList()
  },
  methods: {
    getList() {
      const me = this
      const url = `/ipc/lists?tenantId=${me.tenantId}&queryLike=${me.searchName}&&pageNum=${me
        .pageParmas.pageNum}&pageSize=${me.pageParmas.pageSize}`
      postItem(url)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.rawList = data
            me.list = data.list
            me.total = data.total
            // 获取数据
          } else {
            me.$message.error(msg)
          }
        })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    getOtherList() {
      const me = this
      const url = `/cfgsite/queryby?tenantId=${me.tenantId}`
      getInfo(url)
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.currentSiteList = data
            // 获取数据
          } else {
            me.$message.error(msg)
          }
        })

      const taskUrl = `/ipc-task/query?queryLike=${me.searchName}&pageNum=1&pageSize=1000`
      postItem(taskUrl, { name: '' })
        .then(response => {
          const { success, data, msg } = response.data
          if (success) {
            me.currentTaskList = data.list
            // 获取数据
          } else {
            me.$message.error(msg)
          }
        })
    },

    handleFont(index, row) {
      const me = this
      postItem(`/ipc/onvif?tenantId=${row.tenantId}&siteId=${row.siteId}&ipcId=${row.id}`, row).then(resp => {
        const { success, msg, data } = resp.data
        if (success) {
          const textCfg = data.textCfg
          me.displayForm = textCfg
          const [r = 0, g = 0, b = 0] = textCfg.fontcolor
          me.displayForm.wordColor = `rgba(${r},${g},${b}, 1)`
          me.isShowFontDialog = true
          me.displayForm.ipcId = row.id
          // "rgba(230, 36, 36, 1)".match(/\d+/g).map(x=>parseInt(x))
          me.$message.success("获取摄像头连接成功")
        } else {
          me.$message.error(msg)
        }
      })

      if (row.status == 'allotSucces' || row.status == 'recording' || row.status == 'conn') {
        return
      } else {
        me.$message.error("当前摄像头连接异常 无法设置")
      }
    },

    // 保存显示
    saveDisplay() {
      const me = this
      const item = JSON.parse(JSON.stringify(me.displayForm))
      item.fontcolor = item.wordColor.match(/\d+/g).map(x => parseInt(x)).slice(0, 3)
      // 更改文字
      postItem(`/ipc/text-set?ipcId=${item.ipcId}`, item).then(resp => {
        const { success, msg, data } = resp.data
        if (success) {
          me.$message.success("修改显示成功")
        } else {
          me.$message.error(msg)
        }
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
      getInfo("/ipc/del?id=" + row.id, { id: row.id }).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.$message.success("删除成功")
          me.getList()
        } else {
          me.$message.error(msg)
        }
      })
    },

    // 摄像头预置位置管理
    handlePos(index, row) {
      const me = this
      me.currentPicId = row.id
      if (row.status == 'allotSucces' || row.status == 'recording') {
        me.isShowPosDialog = true
      } else {
        me.$message.error("当前摄像头连接异常 无法设置")
      }
    },
    handleSizeChange(pageSize) {
      this.pageParmas.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(pageIndex) {
      this.pageParmas.pageNum = pageIndex
      this.getList()
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
          postItem("/ipc/modify", me.modifyForm)
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
          postItem("/ipc/add", me.addForm)
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
.ipcindex{

}
</style>
