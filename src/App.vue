<template>
  <div id="app">
    <Modal v-if="this.modal" />
    <div class="page-wrap">
      <NotificationCenter />
      <PromoPage v-if="!this.loggedIn" />
      <AppContainer v-if="this.loggedIn" />
    </div>
  </div>
</template>

<script>
import NotificationCenter from "./components/NotificationCenter.vue";
import PromoPage from "./components/PromoPage.vue";
import Modal from "./components/Modal.vue";
import AppContainer from "./components/AppContainer.vue";

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
    NotificationCenter,
    Modal,
    PromoPage,
    AppContainer
  }
};
</script>

<style>
.page-wrap {
  position: relative;
}
</style>


