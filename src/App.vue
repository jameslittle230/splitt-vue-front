<template>
  <div id="app">
    <div v-if="this.modal">
      <div class="backdrop" v-on:click="closeModal" v-on:keyup.esc="closeModal" tabindex="0"></div>
      <div class="modal">
        <div class="modal-head">
          <span v-on:click="closeModal" class="modal-close-button">&times;</span>
        </div>

        <div class="modal-body">
          <component v-bind:is="modal">View not available. You shouldn't be seeing this.</component>
        </div>
      </div>
    </div>

    <PromoPage v-if="!this.loggedIn" />

    <div v-if="this.loggedIn">
      <UserInfo />
      <SplitCreate />
      <DebtsList />
    </div>
  </div>
</template>

<script>
import PromoPage from "./components/introscreens/PromoPage.vue";
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
    },

    refreshData: function() {
      const self = this;
      this.$store.dispatch("refreshMe").then(function() {
        self.$store.dispatch("refreshGroup").then(function() {
        })
      })
    }
  },

  mounted: function() {
    this.$nextTick(function() {
      window.setInterval(() => {
        if(this.loggedIn) {
          this.refreshData();
        }
      }, 10000);
    });
  },

  components: {
    PromoPage,
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

