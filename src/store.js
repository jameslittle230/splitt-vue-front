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
    history: null,

    openModal: null,
    openModalProps: null,
    presentedNotifications: [],

    undoableVerbs: null
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
        m.isActivated = !!m.name;
        return m;
      });
      state.currentGroup = groupObject;
    },

    setDebtsObject(state, debtsObject) {
      Object.values(debtsObject).map(function(debtObject) {
        let m = debtObject.member;
        m.displayName = m.name || m.email;
        m.isActivated = !!m.name;
        return debtObject;
      });
      state.debts = debtsObject;
    },

    setHistoryObject(state, historyObject) {
      state.history = historyObject;
    },

    logout(state) {
      state.apiToken = null;
      state.me = null;
      state.currentGroup = null;
      state.currentGroupId = null;
      state.debts = null;
      state.history = null;
    },

    setOpenModal(state, component) {
      state.openModal = component;
      state.openModalProps = null;
    },

    setOpenModalWithProps(state, payload) {
      state.openModal = payload.component;
      state.openModalProps = payload.props;
    },

    clearOpenModal(state) {
      state.openModal = null;
      state.openModalProps = null;
    },

    setUndoableVerbs(state, array) {
      state.undoableVerbs = array;
    },

    /**
 * Notifications API:
 * 
 * Notification objects can have three properties:
 * - body: string
 * - actions (optional): [action object]
 * - timer (optional): number representing seconds
 * 
 * The body is the text that gets presented in the main part of the notification.
 * Actions are arbitrary functions and associated labels that get displayed below
 * the "close" x. The timer, an optional property, indicates the lifespan of the
 * alert. Without this property, the alert will be present until it is
 * manually closed.
 * 
 * The notification center, through the data store, is set to hold 8 notifications
 * in the stack at a time; once the ninth is pushed on, the oldest gets popped
 * off the stack.
 * 
 * Action objects have two properties:
 * - fxn: The function that gets called when the action is taken
 * - label: The text displayed in the notification that the user presses.
 * 
 ******************************
 * 
 * Example:
 * 
    self.$store.commit("presentNotification", {
      body: "Created your group.",
      actions: [{
        label: "Undo",
        fxn: function() {
          // undo code
        }
      }],
      timer: 10
    });
 *
 *
 */

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
      context.dispatch("fullRefresh");
    },

    fullRefresh(context) {
      context.dispatch("refreshGroup");
      context.dispatch("refreshDebts");
      context.dispatch("refreshHistory");
    },

    refreshDebts(context) {
      networking
        ._getDebts(context.state.apiToken, context.state.currentGroupId)
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
        });
    },

    refreshHistory(context) {
      networking
        ._getHistory(context.state.apiToken, context.state.currentGroupId)
        .then(function(response) {
          context.commit("setHistoryObject", response.data);
        });
    },

    initialiseStore(context) {
      if (localStorage.getItem("store")) {
        var savedState = JSON.parse(localStorage.getItem("store"));
        this.replaceState(Object.assign(context.state, savedState));
        this.commit("clearOpenModal");

        if (context.state.apiToken) {
          context.dispatch("refreshMe").then(() => {
            if (context.state.currentGroupId) {
              context.dispatch("fullRefresh");
            }
          });
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
