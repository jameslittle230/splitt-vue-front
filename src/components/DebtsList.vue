<template>
  <div v-if="this.$store.state.debts">
    <h4>Current Debts</h4>
    <p v-if="debts.length == 0">No current debts!</p>

    <div v-for="(memberObject, idx) in debts" v-bind:key="idx">
      <h2>
        <span v-if="memberObject.net < 0">
          You owe {{memberObject.member.displayName}}
          <MoneyDisplay v-bind:amount="memberObject.net * -1" />
        </span>

        <span v-if="memberObject.net > 0">
          {{memberObject.member.displayName}} owes you
          <MoneyDisplay v-bind:amount="memberObject.net" />
        </span>
      </h2>

      <p
        class="inactive-account"
        v-if="!memberObject.member.isActivated"
      >This user has not logged into Splitt yet.</p>

      <div class="details">
        <p>
          <button v-on:click="reconcile(memberObject.member.id)">Mark as Paid</button>
        </p>

        <h3 v-if="memberObject.owedTotal > 0 && memberObject.createdTotal > 0">
          You owe {{memberObject.member.displayName}}
          <MoneyDisplay v-bind:amount="memberObject.owedTotal" />
        </h3>

        <ul v-if="memberObject.owedTotal > 0">
          <SplitListing
            v-for="split in memberObject.owed"
            v-bind:key="split.id"
            v-bind:split="split"
          />
        </ul>

        <h3 v-if="memberObject.createdTotal > 0 && memberObject.owedTotal > 0">
          {{memberObject.member.displayName}} owes you
          <MoneyDisplay v-bind:amount="memberObject.createdTotal" />
        </h3>

        <ul v-if="memberObject.createdTotal > 0">
          <SplitListing
            v-for="split in memberObject.created"
            v-bind:key="split.id"
            v-bind:split="split"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Networker from "../networking";
import SplitListing from "./SplitListing.vue";
import MoneyDisplay from "./MoneyDisplay";

export default {
  computed: {
    debts: function() {
      return Object.keys(this.$store.state.debts)
        .map(key => this.$store.state.debts[key])
        .filter(debt => debt.net != 0);
    },

    groupMembers: function() {
      return this.$store.state.currentGroup.members;
    },

    txns: function() {
      return this.$store.state.currentGroup.transactions;
    }
  },

  methods: {
    reconcile: function(memberId) {
      var self = this;
      Networker.reconcileDebt(this.$store.state.currentGroupId, memberId)
        .then(function() {
          self.$store.dispatch("refreshDebts");
        })
        .catch(function(error) {
          Networker.log(error);
        });
    }
  },

  components: { SplitListing, MoneyDisplay }
};
</script>

<style scoped>
.details {
  margin-bottom: 3em;
  padding-left: 1em;
  border-left: 1px solid hsla(0, 0%, 0%, 0.3);
}

h2 {
  font-size: 1.8em;
  margin: 1rem 0;
}

h2 button {
  font-size: 1rem;
  margin-left: 1em;
  position: relative;
  top: -0.2em;
}

h3 {
  font-size: 1.4em;
  margin: 0 0 0.7em;
}

ul {
  margin: 0.2em 0 3em;
  padding-left: 1em;
}

.inactive-account {
  text-transform: uppercase;
  font-size: 0.9em;
  letter-spacing: 0.1em;
  font-style: italic;
  color: hsla(0, 0%, 0%, 0.7);
}
</style>
