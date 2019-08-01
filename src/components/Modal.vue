<template>
  <div>
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
</template>

<script>
import Login from "./modals/Login.vue";
import SignUp from "./modals/SignUp.vue";
import NewGroup from "./modals/NewGroup.vue";
import GroupInfo from "./modals/GroupInfo.vue";
import JoinGroup from "./modals/JoinGroup.vue";
import AccountSettings from "./modals/AccountSettings.vue";
import AppInfo from "./modals/AppInfo.vue";

import GroupModalContainer from "./modals/GroupModalContainer.vue";

export default {
  computed: {
    modal: function() {
      return this.$store.state.openModal;
    }
  },

  methods: {
    closeModal: function() {
      this.$store.commit("clearOpenModal");
    },
  },

  components: {
    Login,
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
