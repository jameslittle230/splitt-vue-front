import axios from "axios";
import store from "./store.js";

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait = 250, immediate = true) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

var logoutAndNotify = debounce(function() {
  store.commit("logout");
  store.commit("presentNotification", {
    body: "You have been logged out.",
    timer: 10
  });
});

var notifyAbout500 = debounce(function() {
  store.commit("presentNotification", {
    body:
      "The server crashed while performing this action. This has been reported.",
    timer: 10
  });
});

function makeNetworker() {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL
  });

  const isHandlerEnabled = (config = {}) => {
    return config.hasOwnProperty("handlerEnabled") && !config.handlerEnabled
      ? false
      : true;
  };

  const errorHandler = error => {
    if (isHandlerEnabled(error.config)) {
      console.log(error.response.status);
      if (error.response.status == 401) {
        logoutAndNotify();
      } else if (error.response.status >= 500 && error.response.status <= 599) {
        debounce(notifyAbout500);
      } else {
        return Promise.reject({ ...error });
      }
    }
    return Promise.reject({ ...error });
  };

  const successHandler = response => {
    if (isHandlerEnabled(response.config)) {
      // Handle responses
    }
    return response;
  };

  instance.interceptors.response.use(
    response => successHandler(response),
    error => errorHandler(error)
  );

  return {
    a: instance,

    _getMe: function(apiToken) {
      return this.a.get("/me", {
        params: {
          api_token: apiToken
        }
      });
    },

    _getGroup: function(apiToken, groupID) {
      return this.a.get(`/groups/${groupID}`, {
        params: {
          api_token: apiToken
        }
      });
    },

    _getDebts: function(apiToken, groupID) {
      return this.a.get(`/groups/${groupID}/debts/`, {
        params: {
          api_token: apiToken
        }
      });
    },

    _getHistory: function(apiToken, groupID) {
      return this.a.get(`/groups/${groupID}/events/`, {
        params: {
          api_token: apiToken
        }
      });
    },

    reconcileDebt: function(groupID, memberID) {
      return this.a
        .request({
          url: `/groups/${groupID}/debts`,
          method: "put",
          data: {
            reconciled_members: [memberID]
          },
          params: {
            api_token: store.state.apiToken
          }
        })
        .catch(function() {
          store.commit("presentNotification", {
            body:
              "Splitt has encountered an error reconciling these splits. This error has been reported.",
            timer: 10
          });
        });
    },

    undoEvent: function(eventId) {
      return this.a.request({
        url: `/events/${eventId}/undo`,
        method: "post",
        params: {
          api_token: store.state.apiToken
        }
      });
    },

    /**
     *
     * @param {number} full_amount The amount of the transaction
     * @param {string} description The transaction's memo
     * @param {[Object]} splits Array of split objects
     * @returns {AxiosPromise}
     */
    createTransactionWithSplits: function(
      full_amount,
      memo,
      long_description,
      date,
      splits
    ) {
      const currentGroup = store.state.currentGroupId;
      return this.a
        .request({
          url: `/groups/${currentGroup}/transactions`,
          method: "post",
          data: {
            full_amount: full_amount,
            description: memo,
            long_description: long_description,
            altered_date: date,
            splits: splits
          },
          params: {
            api_token: store.state.apiToken
          }
        })
        .catch(function() {
          store.commit("presentNotification", {
            body:
              "Splitt has encountered an error getting up-to-date data. This error has been reported.",
            timer: 10
          });
        });
    },

    createNewGroup: function(name, members) {
      return this.a.request({
        url: `/groups`,
        method: "post",
        data: {
          name: name,
          members: members
        },
        params: {
          api_token: store.state.apiToken
        }
      });
    },

    groupSearch: function(q) {
      return this.a.get(`/groupsearch`, {
        params: {
          api_token: store.state.apiToken,
          q: q
        }
      });
    },

    addSelfToGroup: function(groupID) {
      return this.a.request({
        url: `/groups/${groupID}`,
        method: "put",
        data: {
          members: [store.state.me.email]
        },
        params: {
          api_token: store.state.apiToken
        }
      });
    },

    createUser: function(name, email, password) {
      return this.a.post("/group_members", {
        name: name,
        email: email,
        password: password
      });
    },

    login: function(email, password) {
      return this.a.post("/login", {
        email: email,
        password: password
      });
    },

    getUndoableVerbs: function() {
      return this.a.get("/undoable_verbs");
    },

    log: function(object) {
      const data = {
        text: `>>> \`\`\`${JSON.stringify(object, null, 4)}\`\`\``
      };

      if (process.env.NODE_ENV == "production") {
        axios
          .post(process.env.VUE_APP_ERROR_WEBHOOK, data, {
            withCredentials: false,
            transformRequest: [
              (data, headers) => {
                delete headers.post["Content-Type"];
                return data;
              }
            ]
          })
          .catch(function(error) {
            /* eslint-disable no-console */
            console.log(error);
            /* eslint-enable no-console */
          });
      } else {
        /* eslint-disable no-console */
        // console.log(object);
        /* eslint-enable no-console */
      }
    },

    sendFeedback: function(msg) {
      const data = {
        username: store.state.me.name,
        text: `>>> ${msg}`
      };

      axios
        .post(process.env.VUE_APP_FEEDBACK_WEBHOOK, JSON.stringify(data), {
          withCredentials: false,
          transformRequest: [
            (data, headers) => {
              delete headers.post["Content-Type"];
              return data;
            }
          ]
        })
        .catch(function(error) {
          /* eslint-disable no-console */
          console.log(error);
          /* eslint-enable no-console */
        });
    }
  };
}

export default makeNetworker();
