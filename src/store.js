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

    openModal: null
  },

  mutations: {
    setUserFromLogin(state, userObject) {
      state.me = userObject;
      state.apiToken = userObject.api_token;
    },

    setUserFromMe(state, userObject) {
      state.me = userObject;
    },

    // addTransaction(state, txnObject) {
    //   state.currentGroup.transactions.push(txnObject);
    // },

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
    },

    setOpenModal(state, component) {
      state.openModal = component;
    },

    clearOpenModal(state) {
      state.openModal = null;
    }
  },

  actions: {
    postLogin(context, data) {
      context.commit("setUserFromLogin", data);
      context.dispatch("refreshMe");
    },

    refreshMe(context) {
      networking
        ._getMe(context.state.apiToken)
        .then(function(response) {
          context.commit("setUserFromMe", response.data);
          if (
            context.state.me.groups.length > 0 &&
            context.state.currentGroupId == null
          ) {
            context.dispatch("setGroup", context.state.me.groups[0].id);
          }
        })
        .catch(function(error) {
          networking.log(error);
        });
    },

    setGroup(context, groupId) {
      context.commit("setCurrentGroupId", groupId);
      context.dispatch("refreshGroup");
    },

    refreshDebts(context) {
      networking
        .getDebts(context.state.apiToken, context.state.currentGroupId)
        .then(function(response) {
          context.commit("setDebtsObject", response.data);
        })
        .catch(function(error) {
          networking.log(error);
        });
    },

    refreshGroup(context) {
      networking
        ._getGroup(context.state.apiToken, context.state.currentGroupId)
        .then(function(response) {
          context.commit("setGroupObject", response.data);
        })
        .catch(function(error) {
          networking.log(error);
        });

      /* @TODO: This block is the same as refreshDebts above. Needs refactor. */
      networking
        .getDebts(context.state.apiToken, context.state.currentGroupId)
        .then(function(response) {
          context.commit("setDebtsObject", response.data);
        })
        .catch(function(error) {
          networking.log(error);
        });
    },

    initialiseStore(context) {
      if (localStorage.getItem("store")) {
        var savedState = JSON.parse(localStorage.getItem("store"));
        this.replaceState(Object.assign(context.state, savedState));
        this.commit("clearOpenModal");

        if (context.state.apiToken) {
          context.dispatch("refreshMe");
        }

        if (context.state.currentGroupId) {
          context.dispatch("refreshGroup");
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
