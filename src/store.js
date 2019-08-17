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

    openModal: null,
    presentedNotifications: []
  },

  mutations: {
    setUserFromLogin(state, userObject) {
      state.me = userObject;
      state.apiToken = userObject.api_token;
    },

    setUserFromMe(state, userObject) {
      state.me = userObject;
    },

    setCurrentGroupId(state, groupId) {
      state.currentGroupId = groupId;
    },

    setGroupObject(state, groupObject) {
      // @TODO: This might be better done on the server.
      groupObject.members.map(function(m) {
        m.displayName = m.name || m.email;
        m.isActivated = !m.name && !m.self_created;
        return m;
      });
      state.currentGroup = groupObject;
    },

    setDebtsObject(state, debtsObject) {
      Object.values(debtsObject).map(function(debtObject) {
        debtObject.member.displayName =
          debtObject.member.name || debtObject.member.email;
        debtObject.member.isActivated =
          !debtObject.member.name && !debtObject.member.self_created;
        return debtObject;
      });
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
    },

    presentNotification(state, notification) {
      notification.timestamp = new Date().getTime();
      if (state.presentedNotifications.unshift(notification) > 8) {
        state.presentedNotifications.pop();
      }
    },

    deletePresentedNotification(state, notification) {
      const idx = state.presentedNotifications.indexOf(notification);
      state.presentedNotifications.splice(idx, 1);
    }
  },

  actions: {
    postLogin(context, data) {
      context.commit("setUserFromLogin", data);
      context.dispatch("refreshMe");
      context.commit("clearOpenModal");
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
