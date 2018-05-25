import fetch from '@/utils/fetch'

export function login(username, password) {
  return fetch({
    url: '/mblogin',
    method: 'post',
    // data: {
    //   "loginName":username,
    //   "pwd":password
    // },
    params: {
      "loginName": username,
      "pwd": password
    }
  })
}

export function getInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// 退出登录
export function logout(userId) {
  return fetch({
    url: '/logout',
    method: 'get',
    params: {
      uid: userId
    }
  })
}

// 获取用户菜单
export function getUserMenu(reqestUrl) {
  return fetch({
    url: reqestUrl,
    method: 'get'
  })
}

// 获取用户信息
export function getUserInfo() {
  return fetch({
    url: '/user/info',
    method: 'get'
  })
}

// 获取对应模块权限的许可
export function getUserPermission(params) {
  return fetch({
    url: '/user/permission',
    method: 'get',
    params
  })
}

// 获取验证码
export function GetValCode(loginName, mobile) {
  return fetch({
    url: '/user/send/code',
    method: 'post',
    data: {
      loginName, mobile
    }
  })
}

// 修改密码
export function ModifyPass(params) {
  return fetch.put('/user/forgot', params)
}

// 监测用户是否登录

export function checkUserIsOnline() {
  return fetch.get('/checkUserOnline')
}

