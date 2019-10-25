export default {
  SET_BASE_URL: (state, url, type = false) => {
    state.hasSetUrl = type
    state.BASE_URL = url
  }
}
