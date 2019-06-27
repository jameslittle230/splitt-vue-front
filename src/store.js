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
    me: null,
    currentGroupId: null,
    currentGroup: null,
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
      state.currentGroup.transactions.push(txnObject);
    },

    setCurrentGroupId(state, groupId) {
      state.currentGroupId = groupId;
      state.currentGroup = null;
    },

    setGroupObject(state, groupObject) {
      state.currentGroup = groupObject;
    },

    logout(state) {
      state.apiToken = null;
      state.me = null;
      state.currentGroup = null;
      state.currentGroupId = null;
    }
  },

  actions: {
    postLogin(context, data) {
      const self = this;
      context.commit('setUserFromLogin', data);

      a.get('/me', {
        params: {
          "api_token": data.api_token
        }
      }).then(function(response) {
        context.commit('setUserFromMe', response.data);
        if(context.state.me.groups.length > 0) {
          context.dispatch('setGroup', context.state.me.groups[0].id)
        }
      }).catch(function(error) {
        console.log(error)
      })
    },

    setGroup(context, groupId) {
      context.commit('setCurrentGroupId', groupId);
      const self = this;
      a.get(`/groups/${groupId}`, {
        params: {
          "api_token": context.state.apiToken
        }
      }).then(function(response) {
        context.commit('setGroupObject', response.data)
      }).catch(function(error) {
        console.log(error)
      })
    },

    initialiseStore(context) {
      const self = this;
      if (localStorage.getItem("store")) {
        var savedState = JSON.parse(localStorage.getItem("store"))
        this.replaceState(
          Object.assign(context.state, savedState)
        );

        if(context.state.apiToken) {
          a.get('/me', {
            params: {
              "api_token": savedState.apiToken
            }
          }).then(function(response) {
            self.commit('setUserFromMe', response.data)
          }).catch(function(error) {
            console.log(error)
          })

          if(context.state.currentGroupId) {
            a.get(`/groups/${context.state.currentGroupId}`, {
              params: {
                "api_token": context.state.apiToken
              }
            }).then(function(response) {
              context.commit('setGroupObject', response.data)
            }).catch(function(error) {
              console.log(error)
            })
          }
        }
      }
    },
  }
});

// Subscribe to store updates
store.subscribe((mutation, state) => {
  localStorage.setItem("store", JSON.stringify(state));
});

export default store;
