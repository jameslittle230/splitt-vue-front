import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    apiToken: null,
  },
  mutations: {
    setApiKey(state, token) {
      state.apiToken = token;
    },
    
    initialiseStore(state) {
        // Check if the ID exists
        if(localStorage.getItem('store')) {
            this.replaceState(
                Object.assign(state, JSON.parse(localStorage.getItem('store')))
            );
        }
    }
  },
});

// Subscribe to store updates
store.subscribe((mutation, state) => {
	localStorage.setItem('store', JSON.stringify(state));
});

export default store;