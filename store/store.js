import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

//!Utilize Vuex This Vue App
Vue.use(Vuex)

export const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        allSearchedMaps:[]
    },
    getters:{
        getAllSearchedMaps(state){
            console.log('Work getAllSearchedMaps')
            return state.allSearchedMaps
        }
    },
    mutations:{
        renderSearchResults(state,payload){
            console.log('Work renderSearchResults with payload value ', payload)
            console.log('before AllSearchedMaps ', state.allSearchedMaps)

            // console.log('location ', typeof location)
            // Object.assign(state.allSearchedMaps,location)
            state.allSearchedMaps.unshift(payload)

            state.allSearchedMaps.forEach((item)=>{
                console.log('item value in state ', item.lat)
            })
        },
        cleanSearchResult(state){
            console.log('Search result working ', state)
            state.allSearchedMaps = []
        }
    },
    actions:{
        updateLocation({commit},payload){
            console.log('value payload??? ' ,payload)
            commit('renderSearchResults',payload)
        },
        cleanLocation({commit}){
            commit('cleanSearchResult')
        }
    }
})