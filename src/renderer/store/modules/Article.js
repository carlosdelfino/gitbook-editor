const state = {
  article: localStorage.getItem('articlePath') || '',
  library: JSON.parse(localStorage.getItem('library')) || {
    title: '',
    path: ''
  }
}

const mutations = {
  SET_ARTICLE_PATH (state, path) {
    state.article = path
  },
  SET_LIBRARY (state, library) {
    state.library = library
  }
}

const actions = {
  setPath ({ commit }, path) {
    // do something async
    commit('SET_ARTICLE_PATH', path)
    localStorage.setItem('articlePath', path)
  },
  setLibrary ({ commit }, library) {
    commit('SET_LIBRARY', library)
    localStorage.setItem('library', JSON.stringify(library))
  }
}

const getters = {
  getPath (state) {
    return state.article
  },
  getLibrary (state) {
    return state.library
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
