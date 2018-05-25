import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

// 同步用户信息
const inforeUser = localStorage.getItem("INFORE-LOGIN-USER")

const userMenus = localStorage.getItem("INFORE-LOGIN-USER")

const getLocalUserInfo = function() {
  let result = {}
  if (inforeUser) {
    const userInfo = JSON.parse(inforeUser)
    result = userInfo
  }
  return result
}

const getLocalUserMenus = function() {
  let result = {}
  if (menus) {
    const userInfo = JSON.parse(inforeUser)
    result = userInfo
  }
  return result
}

const user = {
  state: {
    token: getToken(),
    name: getLocalUserInfo().userName || '',
    avatar: '',
    // 角色列表
    roles: getLocalUserInfo().roleIds || [],
    // 菜单
    menus: [],
    // 用户信息
    userInfo: getLocalUserInfo()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERINFO: (state, user) => {
      state.userInfo = user
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.loginName.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.pwd).then(response => {
          const data = response.data
          if (data.success) {
            commit('SET_TOKEN', data.data.token)
            commit('SET_USERINFO', data.data.user)
            commit('SET_ROLES', data.data.user.roleIds)
            localStorage.setItem('token', data.data.token)
            localStorage.setItem('INFORE-LOGIN-USER', JSON.stringify(data.data.user))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.userInfo.id).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          // 清空localStorage
          localStorage.clear()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
