const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  roles: state => state.user.roles,
  userInfo: state => state.user.userInfo,
  userId: state => {
    const user = state.user.userInfo
    if (user) { return user.id } else { return '' }
  },
  name: state => {
    const user = state.user.userInfo
    if (user) { return user.userName } else { return '' }
  },

  // 登录用户的租户ID
  tenantId: state => {
    const user = state.user.userInfo
    if (user) { return user.tenantId } else { return '' }
  },
  tenantName: state => {
    const user = state.user.userInfo
    if (user) { return user.tenantName } else { return '' }
  },

  currentTopMenuName: state => state.app.currentTopMenuName

}
export default getters
