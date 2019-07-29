<template>
  <div v-if="this.$store.state.debts">
    <h4>Current Debts</h4>
    <p v-if="debts.length == 0">No debts yet!</p>

    <details v-for="(memberObject, idx) in debts" v-bind:key="idx">
      <summary v-if="memberObject.net < 0">
        You owe {{memberObject.member.name}}
        <MoneyDisplay v-bind:amount="memberObject.net * -1" />
      </summary>

      <summary v-if="memberObject.net > 0">
        {{memberObject.member.name}} owes you
        <MoneyDisplay v-bind:amount="memberObject.net" />
      </summary>

      <div class="expanded">
        <p>
          <button v-on:click="reconcile(memberObject.member.id)">Mark as Paid</button>
        </p>
        
        <h3 v-if="memberObject.owedTotal > 0 && memberObject.createdTotal > 0">
          You owe {{memberObject.member.name}}
          <MoneyDisplay v-bind:amount="memberObject.owedTotal" />
        </h3>

        <ul v-if="memberObject.owedTotal > 0">
          <li v-for="split in memberObject.owed" v-bind:key="split.id">
            <MoneyDisplay v-bind:amount="split.amount" />:
            {{split.transaction.description}}
          </li>
        </ul>

        <h3 v-if="memberObject.createdTotal > 0 && memberObject.owedTotal > 0">
          {{memberObject.member.name}} owes you
          <MoneyDisplay v-bind:amount="memberObject.createdTotal" />
        </h3>

        <ul v-if="memberObject.createdTotal > 0">
          <li v-for="split in memberObject.created" v-bind:key="split.id">
            <MoneyDisplay v-bind:amount="split.amount" />:
            {{split.transaction.description}}
          </li>
        </ul>
      </div>
    </details>
  </div>
</template>

<script>
import Networker from "../networking";
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

  components: { MoneyDisplay }
};
</script>

<style scoped>
.expanded {
  padding: 1em;
  margin-left: 0.25em;
}

details {
  margin-bottom: 1em;
}

summary {
  font-size: 1.8em;
  font-weight: bold;
}

h3 {
  margin: 0;
}

ul {
  margin-top: 0.2em;
}

p {
  margin-top: 0;
}
</style>
