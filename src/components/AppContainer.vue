<template>
  <div>
    <UserInfo />

    <p v-if="userHasNoGroups" class="intro-text">
      <span style="margin-right: 0.5em">
        Welcome to Splitt.
        <br />You're not a member of any groups.
      </span>
      <button v-on:click="showNewGroupModal">Let's change that. &rarr;</button>
    </p>

    <div style="display: flex; margin: 2rem 0; overflow: visible" v-if="debts.length > 0">
      <button
        class="card blue create-button"
        v-if="!userHasNoGroups"
        v-on:click="showSplitCreateModal"
      >+</button>
      <DebtsList />
    </div>

    <div style="display: flex; margin: 2rem 0;" v-if="debts.length == 0">
      <button
        v-on:click="showSplitCreateModal"
        style="font-size: 1.4em; width: 100%;"
      >Create a New Split &rarr;</button>
    </div>

    <History />
    <Footer />
  </div>
</template>

<script>
import Networker from "../networking.js";
import UserInfo from "./UserInfo.vue";
import DebtsList from "./DebtsList.vue";
import History from "./History.vue";
import Footer from "./Footer.vue";

export default {
  components: {
    UserInfo,
    DebtsList,
    History,
    Footer
  },

  computed: {
    userHasNoGroups: function() {
      return (
        this.$store.state.me.groups && this.$store.state.me.groups.length == 0
      );
    },

    debts: function() {
      return Object.keys(this.$store.state.debts)
        .map(key => this.$store.state.debts[key])
        .filter(debt => debt.net != 0);
    }
  },

  methods: {
    showSplitCreateModal: function() {
      this.$store.commit("setOpenModal", "SplitCreate");
    },

    showNewGroupModal: function() {
      this.$store.commit("setOpenModal", "NewGroup");
    }
  },

  mounted: function() {
    Networker.getUndoableVerbs().then(response => {
      this.$store.commit("setUndoableVerbs", response.data);
    });
  }
};
</script>

<style scoped>
.intro-text {
  font-size: 2em;
  margin: 2em 0;
  font-weight: bold;
  text-align: center;
}

.intro-text button {
  display: block;
  margin: 0.3em auto;
  font-size: 0.8em;
}

.create-button {
  font-size: 4rem;
  flex-shrink: 0;
  flex-basis: 8rem;
}
</style>

