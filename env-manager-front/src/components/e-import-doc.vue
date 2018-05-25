<template>
  <div class="eimportdoc" >
    <el-upload  class="upload-demo"
        :action="uploadURL"  :on-success="success"  :before-upload="beforeUpload" :headers="uploadHeaders" :show-file-list="false" accept=".xls, .xlsx"
        >
        <el-button size="small" type="primary" :loading="isload">上传协议文档</el-button>
        <div slot="tip" class="p-h20 p-white el-upload__tip">只能上传Execl文件，且不超过2M</div>
    </el-upload>

    <p v-show="excelFileUrl && excelFileUrl.length > 0" class="p-white p-h40">
       文件错误 请下载文件 更改错误 再次上传 
       <el-button size="small" type="primary" @click="downloadDoc">下载协议文件</el-button>
    </p>


    <section v-show="list.length > 0">
        <el-table element-loading-text="拼命加载中" empty-text="暂无数据"
        :data="list" stripe 
        border fit highlight-current-row>
        <el-table-column label="监控量类型" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.meteKind }}</span>
        </template>
        </el-table-column>
        <el-table-column label="通道号" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.channelNo }}</span>
        </template>
        </el-table-column>
        <el-table-column label="子序号" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.sameMetetypeIndex }}</span>
            </template>
        </el-table-column>
        <el-table-column label="通道名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.channelName }}</span>
        </template>
        </el-table-column>
        <el-table-column label="单位" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.unit }}</span>
        </template>
        </el-table-column>
         <el-table-column label="精度" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.accuracy }}</span>
        </template>
        </el-table-column>
        <el-table-column label="上限" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.upEffect }}</span>
        </template>
        </el-table-column>
        <el-table-column label="下限" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.lowEffect }}</span>
        </template>
        </el-table-column>
        <el-table-column label="遥信量解释" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.explainType }}</span>
        </template>
        </el-table-column>
        <el-table-column label="遥信量类型" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.signalType }}</span>
        </template>
        </el-table-column>

        <el-table-column label="监控量类型" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.currentChooseItem.meteType }}</span>
        </template>
        </el-table-column>
        <el-table-column label="监控量名称" align="center">
        <template slot-scope="scope">
            <span>{{ scope.row.currentChooseItem.metetypeName }}</span>
        </template>
        </el-table-column>
        <el-table-column label="英文名称" align="center">
        <template slot-scope="scope">
            <!-- <span>{{ scope.row.currentChooseItem.metetypeNameEn }}</span> -->
            <el-input  v-model="scope.row.currentChooseItem.metetypeNameEn"></el-input>
        </template>
        </el-table-column>

        <el-table-column label="检查" align="center">
        <template slot-scope="scope">
            <el-button size="mini" @click="handleCheck(scope.$index,  scope.row)"  v-show="scope.row.currentChooseMeteTypeList.length==0">检查</el-button>
            <!-- <el-button size="mini" @click="handleSave(scope.$index,  scope.row)"  v-show="scope.row.currentChooseMeteTypeList.length>0">保存</el-button> -->
            <el-select v-model="scope.row.currentChooseItem" placeholder="请选择确认监控量类型" v-show="scope.row.currentChooseMeteTypeList.length>0">
              <el-option v-for="item in scope.row.currentChooseMeteTypeList" :label="item.meteType" :value="item" :key="item.meteType">
                    <span style="float: left">{{ item.metetypeName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.meteType }}</span>
              </el-option>
            </el-select>
        </template>
        </el-table-column>
       <el-table-column label="操作" align="center">
        <template slot-scope="scope">
            <el-button size="mini" @click="handleSave(scope.$index,  scope.row)"  v-show="scope.row.currentChooseMeteTypeList.length>0" :disabled="scope.row.optState==2">保存</el-button>
        </template>
        </el-table-column>

    </el-table>
    </section>

    <section class="eimportdoc--save">
        <el-button @click="saveBatchData">全部保存</el-button>
        <!-- <el-button @click="cancelSave">取消</el-button> -->
    </section>





  </div>
</template>

<script>
import { getInfo, postItem } from "@/api/advanced"
import Config from '@/config'
const TypeMap = {
  AI: 'telemeter',
  DI: 'telesignal',
  AO: 'teleadjust',
  DO: 'telecontrol',
  CF: 'teleconfig'
}
export default {
  name: "eimportdoc",
  data() {
    return {
      fileList: [],
      list: [],
      uploadURL: Config.FILE_UPLOAD_URL,
      uploadHeaders: {},
      // 出错文件路径下载地址

      excelFileUrl: '',

      isload: false,
      // 上传成功的数据
      rawResp: {}

    }
  },
  props: {
    deviceModel: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.uploadHeaders = {
      'E-User-Token': localStorage.token
    }
  },
  methods: {
    beforeUpload(file) {
      this.isload = true
      if (file && file.size) {
        const size = file.size / 1024
        if (size > 2000) {
          this.$message.error("上传Execl文件不能超过2M")
          this.isload = false
          return false
        }
      }
    },

    // 文件上传成功
    success(resp) {
      const me = this
      me.isload = false
      const { success, data, msg } = resp
      console.log(resp)
      if (success) {
        console.log("文件上传成功")
        const { deviceInfoVo, monitoryPointVo, excelFileUrl, errorSet } = data
        me.rawResp = data
        if (excelFileUrl && excelFileUrl.length > 0) {
          // 协议文件出错  提示 并让用更改文件后上传
          me.excelFileUrl = excelFileUrl
          me.$message.info("文件上传成功,协议文件有错误 请更正后重新上传")
        } else {
          me.excelFileUrl = ''
          me.$message.info("文件上传成功,协议文件正确")
          // 显示列表
          me.list = monitoryPointVo.map(
            x => {
              // 拓展2个属性
              x.currentChooseItem = {
                meteType: '',
                metetypeName: '',
                metetypeNameEn: ''
              }
              //
              x.currentChooseMeteTypeList = []
              // optState 0(为处理) 1(已检查) 2(以保存)
              x.optState = 0
              return x
            }
          )
        }
      } else {
        me.$message.error(msg)
      }
    },

    // 下载协议文件
    downloadDoc() {
      const URL = Config.BASE_API + `/files/downLoadFiles?fileName=` + this.excelFileUrl
      window.open(URL)
    },

    // 检查文件
    handleCheck(index, row) {
      const me = this
      const backdata = JSON.parse(JSON.stringify(row))
      // me.modifyForm = backdata;
      me.isShowEditDialog = true
      const type = TypeMap[row.meteKind]
      const requestUrl = `/${type}/querymetetype?basMeteName=${row.channelName}&deviceType=${me.deviceModel.deviceType}&sameMetetypeIndex=${row.sameMetetypeIndex}`
      // 发送数据 请求
      getInfo(requestUrl).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          // 更新当前列表的list
          const one = row
          row.currentChooseItem = data[0]
          row.currentChooseMeteTypeList = data
          // 标识 已经匹配
          row.optState = 1
          me.$set(me.list, index, row)
        } else {
          me.$message.error(msg)
        }
      })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },
    // 单条保存
    handleSave(index, row) {
      const me = this
      const currentItem = row
      if (currentItem.metetypeNameEn == '') {
        me.$message.info("请填写完整的数据 监控量英文名称")
        return
      }
      const item = {
        "accuracy": row.accuracy,
        "channelName": row.channelName,
        "channelNo": row.channelNo,
        "explainType": row.explainType,
        "lowEffect": row.lowEffect,
        "meteKind": row.meteKind,
        "meteType": row.currentChooseItem.meteType,
        "meteteypeName": row.currentChooseItem.metetypeName,
        "metetypeNameEn": row.currentChooseItem.metetypeNameEn,
        "signalType": row.signalType,
        "unit": row.unit,
        "upEffect": row.upEffect,
        "sameMetetypeIndex": row.sameMetetypeIndex
      }
      // TODO 保存单条数据
      const addInfo = {
        iotBasDeviceModel: me.deviceModel,
        monitoryPointVo: [item]
      }
      const type = TypeMap[row.meteKind]
      const postUrl = `/${type}/addone4importfileinfo`
      postItem(postUrl, addInfo).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.$message.success("保存成功")
          // 按钮不能点击
          const one = row
          one.optState = 2
          me.$set(me.list, index, one)
        } else {
          me.$message.error(msg)
        }
      })
        .catch(err => {
          me.$message.error("网络错误")
        })
    },

    // 批量保存数据
    saveBatchData() {
      const me = this
      // 验证数据的合法性
      const length = me.list.length
      let isValid = true

      for (let i = 0; i < length; i++) {
        const currentOne = me.list[i]
        if (currentOne.metetypeNameEn == '') {
          isValid = false
          break
        }
      }
      if (!isValid) {
        me.$message.info("请填写完整的数据")
        return
      }

      // 批量保存的接口 todo
      const currentList = me.list.filter(x => x.optState == 1)
      if (currentList.length <= 0) {
        me.$message.info("请先上传文件并检查匹配")
        return
      }

      const handerArr = currentList.map(row => {
        const item = {
          "accuracy": row.accuracy,
          "channelName": row.channelName,
          "channelNo": row.channelNo,
          "explainType": row.explainType,
          "lowEffect": row.lowEffect,
          "meteKind": row.meteKind,
          "meteType": row.currentChooseItem.meteType,
          "meteteypeName": row.currentChooseItem.metetypeName,
          "metetypeNameEn": row.currentChooseItem.metetypeNameEn,
          "signalType": row.signalType,
          "unit": row.unit,
          "upEffect": row.upEffect,
          "sameMetetypeIndex": row.sameMetetypeIndex
        }
        return item
      })

      // 去掉已经保存的

      // TODO 保存all数据
      const addInfo = {
        iotBasDeviceModel: me.deviceModel,
        monitoryPointVo: handerArr
      }
      // let type = TypeMap[row.meteKind];
      const postUrl = `/files/addFileDatas`
      postItem(postUrl, addInfo).then(response => {
        const { success, data, msg } = response.data
        if (success) {
          me.$message.success("全部保存成功")
          me.list = me.list.map(x => { x.optState == 2; return x })
          // one.optState = 2;
          // me.$set(me.list, index, one);
        } else {
          me.$message.error(msg)
        }
      })
        .catch(err => {
          me.$message.error("网络错误")
        })

      this.$emit('get-data', me.list)
    },

    cancelSave() {
      this.$emit('cancel-save')
    }

  }
}
</script>
<style lang="scss" scoped>
.eimportdoc {
    &--save{
        margin:16px 0;
    }
}
</style>
