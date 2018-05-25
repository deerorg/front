<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
      <h3 class="title">
        <span class="logo"></span>
        盈峰集团IOT平台
      </h3>
      <el-form-item prop="loginName">
        <el-input  type="text" v-model="loginForm.loginName" :class="{'has-content':loginForm.loginName.length>0}" autoComplete="off" placeholder="请输入用户名或infore邮箱" :maxlength="maxlength" ></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input type="password" :class="{'has-content':loginForm.pwd.length>0}"  @keyup.enter.native="handleLogin" v-model="loginForm.pwd" autoComplete="off" placeholder="请输入密码" :maxlength="maxlength" ></el-input>
      </el-form-item>

      <div class="login-password">
        <el-checkbox v-model="loginForm.isRememberPassword">
          <span class="login-remember-pass-text">记住密码</span>
        </el-checkbox>
        <span class="login-forgot-password" @click="onTapForgotPass">忘记密码？</span>
      </div>

      <el-form-item>
        <el-button type="primary" class="login-btn" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <div class="login-down-tip" @click="downloadChrome">下载使用chrome浏览器， 用户体验更佳</div>
    </el-form>

    <el-dialog title="忘记密码" :visible.sync="isShowDialog">
      <el-form ref="modifyForm" :model="modifyForm" :rules="modifyFormRules" label-position="left"   >
        <el-form-item prop="name">
          <el-input v-model="modifyForm.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item  prop="mobile">
          <el-col :span="18">
             <el-input v-model="modifyForm.mobile" placeholder="请输入手机号" type="tel"></el-input>
          </el-col>
          <el-col class="line" :span="2">&nbsp;</el-col>
          <el-col :span="4">
            <el-button type="primary" @click="onGetValCode" :disabled="isCanGetCode">{{getCodeMsg}}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="regCode">
          <el-input v-model="modifyForm.regCode" placeholder="请输入验证码" type="number"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input v-model="modifyForm.pass" type="password" placeholder="请输入新密码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPass">
          <el-input v-model="modifyForm.confirmPass"  type="password" placeholder="请再次输入新密码" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmToMofifyPass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'md5'
import { getUserMenu, GetValCode, ModifyPass } from '@/api/login'
import store from '@/store/'
// 获取全局的路由配置信息
import Config from '@/config'
import { checkType } from '@/utils/validate'

export default {
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else if (!IG.REG.PASS.test(value)) {
        callback(new Error('有效密码:6-20位字母，数字，减号，下划线'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('用户名不能小于5位'))
      } else if (value.length > 20) {
        callback(new Error('用户名不能超过20位'))
      } else if (!isValidateUsername(value)) {
        callback(new Error('有效的用户名:5-20位以字母开头，字母，数字，减号，下划线'))
      } else {
        callback()
      }
    }

    // 是否是有效用户名
    const isValidateUsername = (value) => {
      return IG.REG.USERNAME.test(value) || IG.REG.PHONE.test(value) || IG.REG.EMAIL.test(value)
    }

    // 计算密码强度-1 0  1 2 3 4
    // <=1 弱密码
    // 2 中密码
    // 3 中强密码
    // 4 强密码
    const calcPassLever = (value) => {
      let lever = -1
      if (!value) {
        lever = 0
      } else {
        let len = value.length
        if (len <= 6) {
          len = 1
        }
        const contains_lovercase = /[a-z]/.test(value)
        const contains_number = /\d/.test(value)
        const contains_uppercase = /[A-Z]/.test(value)
        const contains_line = /[-|_]/.test(value)
        const arr = [contains_lovercase, contains_number, contains_uppercase, contains_line]
        lever = arr.filter(x => x == true).length
      }
      return lever
    }

    const validateMobile = (rule, value, callback) => {
      if (value.length < 11) {
        callback(new Error('手机号码不能小于11位'))
      } else if (!IG.PHONE.test(value)) {
        callback(new Error("请输入有效的11位手机号码"))
      } else {
        callback()
      }
    }

    const validateInputPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.modifyForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else if (calcPassLever(value) <= 1) {
        callback(new Error('密码不安全,请采用6-20位字母，数字，减号，下划线'))
      } else {
        callback()
      }
    }

    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.modifyForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateRegCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (IG.REG.VALCODE.test(value)) {
        callback(new Error('验证码为6位数字!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        loginName: 'admin',
        pwd: '123456',
        isRememberPassword: true
      },
      getCodeMsg: '获取验证码',
      maxlength: 20,
      downloadChromeUrl: 'http://sw.bos.baidu.com/sw-search-sp/software/89c331de74e21/ChromeStandalone_61.0.3163.100_Setup.exe',
      isCanGetCode: false,
      modifyForm: {
        name: '',
        mobile: '',
        pass: '',
        confirmPass: '',
        regCode: ''
      },
      modifyFormRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        mobile: [
          { required: true, message: '请输入手机号' },
          { type: 'tel', trigger: 'blur', validator: validateMobile }
        ],
        regCode: [
          { required: true, message: '请输入6位数字的验证码', trigger: 'blur' },
          { type: 'number', trigger: 'blue', validator: validateRegCode }
        ],
        pass: [
          { required: true, trigger: 'change', validator: validateInputPass }
        ],
        confirmPass: [
          { required: true, trigger: 'blur', validator: validatePass2 }
        ]
      },
      loginRules: {
        loginName: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ]
        // pwd: [
        //   { required: true, trigger: 'blur', validator: validatePass }
        // ]
      },
      loading: false,
      isShowDialog: false
    }
  },
  computed: {
    'isChorme': () => {
      return /chrome/.test(navigator.userAgent.toLowerCase())
    },
    isEnabled() {
      let flag = false
      flag = this.modifyForm.name.length > 0 && this.modifyForm.name.phone.length == 11
      return flag
    }
  },
  mounted() {
    const me = this
    if (window.intervalFlag) {
      clearInterval(window.intervalFlag)
    }
  },
  updated() {
    if (window.intervalFlag) {
      clearInterval(window.intervalFlag)
    }
  },
  methods: {
    downloadChrome() {
      window.location = this.downloadChromeUrl
    },

    handleLogin() {
      const me = this
      me.$refs.loginForm.validate(valid => {
        console.log("是否验证通过", valid)
        if (valid) {
          me.loading = true
          const reqParams = {
            'loginName': me.loginForm.loginName,
            // 'pwd': md5(md5(me.loginForm.pwd))
            'pwd': me.loginForm.pwd
          }
          me.$store.dispatch('Login', reqParams).then((res) => {
            me.loading = false
            const { success, msg, data } = res.data
            const roleIds = data.user.roleIds
            if (roleIds.length <= 0) {
              me.$message.info("用户无权登录系统, 请联系管理员")
              return
            }
            if (success) {
              // me.$router.push({ path: '/home' });
              const reqUrl = roleIds.map(x => {
                return `&roleIds=${x}`
              }).join('')
              const url = `/menu/role-ids-tree?${reqUrl}`
              getUserMenu(url).then(resp => {
                const isSuccess = resp.data.success
                const menuTree = resp.data.data
                if (isSuccess) {
                  // 获取菜单成功 本地化菜单
                  if (typeof menuTree === 'string') {
                    localStorage.setItem("currentUserMenuTree", menuTree)
                  } else if (typeof menuTree === 'object') {
                    localStorage.setItem("currentUserMenuTree", JSON.stringify(menuTree))
                  }
                  me.$router.push({ path: '/home' })
                }
              }).catch(err => {
                me.loading = false
                console.error(err)
              })
            } else {
              me.$message.error(msg)
            }
          }).catch((err) => {
            me.loading = false
            console.log(err)
          })
        } else {
          console.log('错误的信息提交')
          return false
        }
      })
    },
    // 忘记密码
    onTapForgotPass() {
      console.log("忘记密码")
      this.isShowDialog = true
    },

    // 忘记密码 获取验证码
    onGetValCode() {
      const me = this
      const mobile = me.modifyForm.mobile
      const loginName = me.modifyForm.name

      if (loginName == '' || loginName.length <= 3) {
        me.$message("用户名长度不能小于4位")
        return
      }
      if (mobile == '' || mobile.length <= 10) {
        me.$message("手机号码长度为11位")
        return
      }
      GetValCode(loginName, mobile).then(resp => {
        console.log(resp)
        const { code, msg } = resp.data
        if (code == 0) {
          me.$message("验证码发送成功")
          me.isCanGetCode = true
          setTimeout(function() {
            me.isCanGetCode = false
          }, 1000 * 60)
        } else {
          me.$message.error(msg)
        }
      })
    },
    // 提价修改密码
    confirmToMofifyPass() {
      const me = this
      me.$refs.modifyForm.validate(valid => {
        if (valid) {
          const reqParams = {
            loginName: me.modifyForm.name,
            mobile: me.modifyForm.mobile,
            code: me.modifyForm.regCode,
            newPassword: me.modifyForm.pass
            //   newPassword: md5(md5(me.modifyForm.pass))
          }
          ModifyPass(reqParams).then(resp => {
            console.log(resp)
            const { code, msg } = resp.data
            if (code == 0) {
              me.$message("修改密码成功")
              me.isShowDialog = false
            } else {
              me.$message.error("修改密码失败")
            }
          })
        } else {
          console.log("提交修改密码表单错误")
          return false
        }
      })
    }

  }

}
</script>

<style rel="stylesheet/scss" lang="scss">
.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 5px;
}
.login-container {
    position: relative;
    width: 100%;
    height: 100%;
    // background: url(../../assets/img/ic_login_bg.png);
    background-size:cover;
    overflow: hidden;
  // input:-webkit-autofill {
  //   -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
  //   -webkit-text-fill-color: #fff !important;
  // }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    padding: 16px 20px;

  }
  .el-input {
    display: inline-block;
    height: 42px;
    line-height: 42px;
    border-radius: 4px;
    border: solid 1px #e5e5e5;
    font-size: 14px;
    color: #333;
    // &.has-content{
    //    background: #faffbd;
    // }
  }
  .title {
    height: 40px;
    font-size: 26px;
    letter-spacing: -0.4px;
    // color: #333333;
    color:#fff;
    text-align: center;
    .logo {
      display: inline-block;
      width: 40px;
      height: 40px;
      background: url(../../assets/img/ic_logo.png);
      background-size: cover;
      vertical-align: top;
    }
  }
  .login-form {
    position: fixed; // position: absolute;
    left: 0;
    right: 0;
    width: 396px;
    height: 376px;
    padding: 4px 30px 30px 30px; // margin: 323px auto auto auto;
    // margin:20% auto auto auto;
    left: 50%;
    top: 50%;
    margin-left: -198px;
    margin-top: -188px;
    border-radius: 4px;
    // background-color;
    .login-password {
      height: 16px;
      margin-top: 20px;
      margin-bottom: 20px;
      .login-remember-pass-text {
        color:#fff;
      }
      .login-forgot-password {
        float: right;
        color: #3b8cff;
      }
    }
    .login-btn {
      display: block;
      width: 100%;
      height: 42px;
      font-size: 20px;
    }

    .login-down-tip {
      text-align: left;
      font-size: 16px;
      height: 16px;
      margin-top: 20px;
      color: #398dee;
    }
  }

  .forget-pwd {
    color: #fff;
  }
}
</style>
