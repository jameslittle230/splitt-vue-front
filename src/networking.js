import axios from "axios";
import store from "./store.js";

export default {
  a: axios.create({
    baseURL: process.env.VUE_APP_API_URL
  }),

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

  getDebts: function(apiToken, groupID) {
    return this.a.get(`/groups/${groupID}/debts/`, {
      params: {
        api_token: apiToken
      }
    });
  },

  reconcileDebt: function(groupID, memberID) {
    var data = { reconciled: {} };
    data["reconciled"][memberID] = 1;
    return this.a.request({
      url: `/groups/${groupID}/debts`,
      method: "put",
      data: data,
      params: {
        api_token: store.state.apiToken
      }
    });
  },

  /**
   * @param splitID {String} The ID of the split that gets reconciled
   * @returns {AxiosPromise}
   */
  reconcileSplit: function(splitID) {
    return this.a.request({
      url: `/splits/${splitID}`,
      method: "put",
      data: {
        reconciled: 1
      },
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
  createTransactionWithSplits: function(full_amount, memo, long_description, date, splits) {
    const currentGroup = store.state.currentGroupId;
    return this.a.request({
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

  log: function(object) {
    const data = {
      "text": `>>> \`\`\`${JSON.stringify(object, null, 4)}\`\`\``,
    }
    
    if(process.env.NODE_ENV === "production") {
      axios.post(process.env.VUE_APP_ERROR_WEBHOOK, JSON.stringify(data), {
        withCredentials: false,
        transformRequest: [(data, headers) => {
          delete headers.post["Content-Type"]
          return data
        }]
      }).catch(function() {
        // At this point we're in too deep
      })
    } else {

      /* eslint-disable no-console */
      console.log(object);
      /* eslint-enable no-console */
    }
  },

  sendFeedback: function(msg) {
    const data = {
      "username": store.state.me.name,
      "text": `>>> ${msg}`,
    }
    
    axios.post(process.env.VUE_APP_FEEDBACK_WEBHOOK, JSON.stringify(data), {
      withCredentials: false,
      transformRequest: [(data, headers) => {
        delete headers.post["Content-Type"]
        return data
      }]
    }).catch(function(error) {
      /* eslint-disable no-console */
      console.log(error);
      /* eslint-enable no-console */
    })
  }
};
