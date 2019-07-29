<template>
  <div id="app">
    <div v-if="this.modal">
      <div class="backdrop" v-on:click="closeModal"></div>
      <div class="modal">
        <div class="modal-head">
          <span v-on:click="closeModal" class="modal-close-button">&times;</span>
        </div>

        <div class="modal-body">
          <component v-bind:is="modal">To Do</component>
        </div>
      </div>
    </div>

    <div v-if="!this.loggedIn">
      <h1 class="title">Splitt</h1>
      <p class="subtitle">
        <i>By James Little</i>
      </p>
      <hr />
      <div style="display: flex; justify-content: space-between;">
        <div style="width: 48%">
          <Login />
        </div>
        <div style="width: 48%;">
          <SignUp />
        </div>
      </div>
    </div>

    <div v-if="this.loggedIn">
      <UserInfo />
      <SplitCreate />
      <DebtsList />
    </div>
  </div>
</template>

<script>
import Login from "./components/introscreens/Login.vue";
import SignUp from "./components/introscreens/SignUp.vue";

import UserInfo from "./components/UserInfo.vue";
import SplitCreate from "./components/SplitCreate.vue";
import DebtsList from "./components/DebtsList.vue";

import NewGroup from "./components/modals/NewGroup.vue";
import GroupInfo from "./components/modals/GroupInfo.vue";
import JoinGroup from "./components/modals/JoinGroup.vue";
import AccountSettings from "./components/modals/AccountSettings.vue";
import AppInfo from "./components/modals/AppInfo.vue";

import GroupModalContainer from "./components/GroupModalContainer.vue";

export default {
  name: "app",
  computed: {
    loggedIn() {
      return this.$store.state.apiToken !== null;
    },

    modal: function() {
      return this.$store.state.openModal;
    }
  },

  methods: {
    closeModal: function() {
      this.$store.commit("clearOpenModal");
    }
  },

  components: {
    Login,
    UserInfo,
    SplitCreate,
    DebtsList,
    SignUp,
    NewGroup,
    GroupInfo,
    JoinGroup,
    AccountSettings,
    GroupModalContainer,
    AppInfo
  }
};
</script>

<style scoped>
.title {
  margin-top: 0.25em;
  font-size: 3rem;
  text-align: center;
}

.subtitle {
  margin: 0;
  text-align: center;
}
</style>

