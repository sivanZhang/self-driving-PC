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
    setProperty(state, arr) {
        state.Property = arr.concat();
    },
    setTotal(state, number) {
        state.Total = number;
    },
    setListType(state, str) {
        state.ListType = str;
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