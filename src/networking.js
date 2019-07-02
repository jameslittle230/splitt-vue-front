import axios from "axios";
import store from "./store.js";

export default {
  a: axios.create({
    baseURL: "http://back.test/api/"
  }),

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
  createTransactionWithSplits: function(full_amount, description, splits) {
    const currentGroup = store.state.currentGroupId;
    return this.a.request({
      url: `/groups/${currentGroup}/transactions`,
      method: "post",
      data: {
        full_amount: full_amount,
        description: description,
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
    })
  },

  addSelfToGroup: function(groupID) {
    return this.a.request({
      url: `/groups/${groupID}`,
      method: "put",
      data: {
        members: [store.state.me.email],
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
    })
  }
};