<template>
  <div id="app">
    <Modal v-if="this.modal" />
    <PromoPage v-if="!this.loggedIn" />
    <AppContainer v-if="this.loggedIn" />
  </div>
</template>

<script>
import PromoPage from "./components/PromoPage.vue";
import Modal from "./components/Modal.vue";
import AppContainer from "./components/AppContainer.vue"

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

  components: {
    Modal,
    PromoPage,
    AppContainer
  }
};
</script>

