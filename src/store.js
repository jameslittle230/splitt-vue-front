import Vue from "vue";
import Vuex from "vuex";
import networking from "./networking";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    apiToken: null,
    me: null,
    currentGroupId: null,
    currentGroup: null,
    debts: null,
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
    },

    setGroupObject(state, groupObject) {
      state.currentGroup = groupObject;
    },

    setDebtsObject(state, debtsObject) {
      state.debts = debtsObject;
    },

    logout(state) {
      state.apiToken = null;
      state.me = null;
      state.currentGroup = null;
      state.currentGroupId = null;
      state.debts = null;
    }
  },

  actions: {
    postLogin(context, data) {
      context.commit("setUserFromLogin", data);
      context.dispatch('refreshMe');
    },

    refreshMe(context) {
      networking._getMe(context.state.apiToken)
        .then(function(response) {
          context.commit("setUserFromMe", response.data);
          if (context.state.me.groups.length > 0) {
            context.dispatch("setGroup", context.state.me.groups[0].id);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    setGroup(context, groupId) {
      context.commit("setCurrentGroupId", groupId);
      
      networking._getGroup(context.state.apiToken, groupId)
        .then(function(response) {
          context.commit("setGroupObject", response.data);
        })
        .catch(function(error) {
          console.log(error);
        });

      networking.getDebts(context.state.apiToken, groupId)
        .then(function(response) {
          context.commit("setDebtsObject", response.data);
        })
        .catch(function(error) {
          console.log(error);
        })
    },

    initialiseStore(context) {
      if (localStorage.getItem("store")) {
        var savedState = JSON.parse(localStorage.getItem("store"));
        this.replaceState(Object.assign(context.state, savedState));

        if (context.state.apiToken) {
          context.dispatch("refreshMe")
        }
      }
    }
  }
});

// Subscribe to store updates
store.subscribe((mutation, state) => {
  localStorage.setItem("store", JSON.stringify(state));
});

export default store;
