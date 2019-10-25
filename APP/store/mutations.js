export default {
    setToken(state, str) {
        state.estateToken = str;
        if (str) {
            uni.setStorageSync('estateToken', str);
        } else {
            uni.removeStorageSync('estateToken');
        }
    },
    setUserName(state, str) {
        state.user_name = str;
    },
    setPortrait(state, str) {
        state.portrait = str;
    },
    setPortrait(state, str) {
        state.portrait = str;
    },
    setUserId(state, num) {
        state.userId = num;
        if (num) {
            uni.setStorageSync('userId', num);
        } else {
            uni.removeStorageSync('userId');
        }
    }
}