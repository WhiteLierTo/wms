const state = {
  headerId: ''
}

const mutations = {
  GET_STOCK_LINE: (state, headerId) => {
    state.headerId = headerId
  }
}

const actions = {
  getStockLine({ commit }, headerId) {
    commit('GET_STOCK_LINE', headerId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

