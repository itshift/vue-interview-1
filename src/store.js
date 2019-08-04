import Vue from 'vue'
import Vuex from 'vuex'
import mockGenerator from './mock'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    startIndex: 1,
    number: 20,
    dataList: []
  },
  mutations: {
    // 将dataList,startIndex进行重置；
    resetTestPage (state){
      state.dataList = []
      state.startIndex = 1
    },
    // 设置数组
    setDataList (state, data) {
      state.dataList = state.dataList.concat(data)
    },
    // 设置startIndex
    setStartIndex (state, number) {
      state.startIndex += number
    }
  },
  getters: {
    // 获取平均值
    getAverage: state => {
      let num = 0
      state.dataList.forEach(item => {
        num += item.data
      })
      if (state.dataList.length === 0) {
        return 0
      } else {
        return (num / state.dataList.length).toFixed(2)
      }
    }
  },
  actions: {
    // 获取数据
    getDataCall (context) {
      const { startIndex, number } = context.state
      return new Promise((resolve, reject)=> {
          mockGenerator(startIndex, number).then(list => { 
            context.commit('setDataList', list)
            context.commit('setStartIndex', number)
            resolve()
          })
      })
    }
  }
})
