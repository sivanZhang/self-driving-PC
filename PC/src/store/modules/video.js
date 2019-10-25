//项目 公共状态
import Cookies from 'js-cookie'

function getIds() {
    return Cookies.get('Selection')
}
const state = {
    Selection: getIds() ? JSON.parse(getIds()) : []
}

const mutations = {
    SET_SELECTION: (state, arr) => {
        state.Selection = [...arr]
        Cookies.set('Selection', arr)
    }
}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}