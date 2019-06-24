import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiToken: ""
  },
  mutations: {
    setApiKey(state, token) {
      state.apiToken = token;
    }
  }
});
