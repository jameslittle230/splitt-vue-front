<template>
  <div>
    <p v-if="userHasNoGroups" class="intro-text">
      <span style="margin-right: 0.5em">You're not a member of any groups.</span>
      <button v-on:click="showNewGroupModal">Let's change that.</button>
    </p>
    <UserInfo />
    <p v-if="!userHasNoGroups" style="margin: 1rem 0 0">
      <button
        class="lowkey-button"
        style="font-size: 1.4em; width: 100%"
        v-on:click="showSplitCreateModal"
      >Create a New Split</button>
    </p>
    <div class="grid">
      <DebtsList />
      <History />
    </div>
    <Footer />
  </div>
</template>

<script>
import UserInfo from "./UserInfo.vue";
// import SplitCreate from "./SplitCreate.vue";
import DebtsList from "./DebtsList.vue";
import History from "./History.vue";
import Footer from "./Footer.vue";

export default {
  components: {
    UserInfo,
    // SplitCreate,
    DebtsList,
    History,
    Footer
  },

  computed: {
    userHasNoGroups: function() {
      return (
        this.$store.state.me.groups && this.$store.state.me.groups.length == 0
      );
    }
  },

  methods: {
    showSplitCreateModal: function() {
      this.$store.commit("setOpenModal", "SplitCreate");
    }
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 60% 1fr;
  grid-column-gap: 2em;
}

@media screen and (max-width: 40rem) {
  .grid {
    display: block;
  }
}

.intro-text {
  font-size: 2em;
  margin: 2em 0;
  font-weight: bold;
}

.intro-text button {
  display: block;
  margin-top: 0.3em;
  font-size: 0.8em;
}
</style>

