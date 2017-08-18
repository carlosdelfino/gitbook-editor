const state = {
  article: ''
}

const mutations = {
  SET_ARTICLE_PATH (state, path) {
    state.article = path
  }
}

const actions = {
  setPath ({ commit }, path) {
    // do something async
    commit('SET_ARTICLE_PATH', path)
  }
}

const getters = {
  getPath (state) {
    return state.article
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
