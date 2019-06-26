import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";

Vue.use(Vuex);

const a = Axios.create({
  baseURL: 'http://back.test/api/'
})

const store = new Vuex.Store({
  state: {
    apiToken: null,
    me: null
  },
  mutations: {
    setUserFromLogin(state, userObject) {
      state.me = userObject;
      state.apiToken = userObject.api_token;
    },

    setUserFromMe(state, userObject) {
      state.me = userObject;
    },

    addTransaction(state, txnObject) {
      state.me.transactions.append(txnObject);
    },

    logout(state) {
      state.apiToken = null;
      state.me = null;
    }
  },

  actions: {
    postLogin(state, data) {
      const self = this;
      this.commit('setUserFromLogin', data);
      console.log(state.apiToken);
      a.get('/me', {
        params: {
          "api_token": data.api_token
        }
      }).then(function(response) {
        self.commit('setUserFromMe', response.data)
      }).catch(function(error) {
        console.log(error)
      })
    },

    initialiseStore(state) {
      const self = this;
      if (localStorage.getItem("store")) {
        var savedState = JSON.parse(localStorage.getItem("store"))
        this.replaceState(
          Object.assign(state, savedState)
        );

        a.get('/me', {
          params: {
            "api_token": savedState.apiToken
          }
        }).then(function(response) {
          self.commit('setUserFromMe', response.data)
        }).catch(function(error) {
          console.log(error)
        })
      }
    },
  }
});

// Subscribe to store updates
store.subscribe((mutation, state) => {
  localStorage.setItem("store", JSON.stringify(state));
});

export default store;
