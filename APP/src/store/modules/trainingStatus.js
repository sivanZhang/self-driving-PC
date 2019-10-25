//实训项目 公共状态
import {
    getTrainingProject
} from "@/api/training"
const state = {
    trainingProject :null
}

const mutations = {
    SET_TRAINPROJECT:(state,arr)=>{
        state.trainingProject = [...arr]
    }
}

const actions = {
    get_TrainProject({
        commit
    },params) {
        getTrainingProject().then(({
            data
        })=>{
            commit('SET_TRAINPROJECT',data.msg)
        }).catch(()=>{
            commit('SET_TRAINPROJECT',null)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}