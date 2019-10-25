const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.login.token,
  avatar: state => state.login.avatar,
  name: state => state.login.name,
  introduction: state => state.login.introduction,
  permission_routes: state => state.permission.routes,
  baseUrl: state => state.BASE_URL,
  hasSetUrl: state => state.hasSetUrl,
}
export default getters
