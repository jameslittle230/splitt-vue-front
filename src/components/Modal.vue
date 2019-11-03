<template>
  <div>
    <div class="backdrop" v-on:click="closeModal"></div>
    <div class="modal" v-bind:style="{ maxWidth: modalWidth + 'px' }" v-on:keyup.esc="closeModal">
      <div class="modal-head">
        <span v-on:click="closeModal" class="modal-close-button">&times;</span>
      </div>

      <div class="modal-body">
        <component
          v-bind:is="modal"
          v-bind="props"
        >View not available. You shouldn't be seeing this.</component>
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
import SplitCreate from "./modals/SplitCreate.vue";

export default {
  computed: {
    modal: function() {
      return this.$store.state.openModal;
    },

    props: function() {
      return this.$store.state.openModalProps;
    },

    modalWidth: function() {
      switch (this.$store.state.openModal) {
        case "SplitCreate":
          return 850;
        default:
          return 600;
      }
    }
  },

  methods: {
    closeModal: function() {
      this.$store.commit("clearOpenModal");
    }
  },

  components: {
    Login,
    SignUp,
    NewGroup,
    GroupInfo,
    JoinGroup,
    AccountSettings,
    AppInfo,
    SplitCreate
  }
};
</script>
