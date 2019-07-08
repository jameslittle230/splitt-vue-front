<template>
  <div v-if="this.$store.state.debts">
    <h2>Debts</h2>

    <p v-if="debts.length == 0">No debts yet!</p>
    
    <details 
      v-for="(memberObject, idx) in debts"
      v-bind:key="idx"
    >
      <summary v-if="memberObject.net < 0">
        You owe {{memberObject.member.name}} 
        <MoneyDisplay v-bind:amount="memberObject.net * -1" />
      </summary>
      
      <summary v-if="memberObject.net > 0">
        {{memberObject.member.name}} owes you 
        <MoneyDisplay v-bind:amount="memberObject.net" />
      </summary>

      <div class="expanded">
        <p><button v-on:click="reconcile(memberObject.member.id)">Mark as Paid</button></p>
        <h4>You owe {{memberObject.member.name}} <MoneyDisplay v-bind:amount="memberObject.owedTotal" /></h4>
        <ul>
          <li 
            v-for="split in memberObject.owed"
            v-bind:key="split.id"
          >
            <MoneyDisplay v-bind:amount="split.amount" />: {{split.transaction.description}}
          </li>
        </ul>

        <h4>{{memberObject.member.name}} owes you <MoneyDisplay v-bind:amount="memberObject.createdTotal" /></h4>
        <ul>
          <li 
            v-for="split in memberObject.created"
            v-bind:key="split.id"
          >
            <MoneyDisplay v-bind:amount="split.amount" />: {{split.transaction.description}}
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
        .filter(debt => debt.net != 0)
    },

    groupMembers: function() {
      return this.$store.state.currentGroup.members
    },

    txns: function() {
      return this.$store.state.currentGroup.transactions
    },
  },

  methods: {
    reconcile: function(memberId) {
      var self = this;
      Networker.reconcileDebt(this.$store.state.currentGroupId, memberId)
        .then(function() {
          self.$store.dispatch("setGroup", self.$store.state.currentGroupId);
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  },

  components: { MoneyDisplay }
};
</script>

<style scoped>
.expanded {
  border-left: 1px solid #aaa;
  padding: 1em;
  margin-left: 0.25em;
}

summary {
  font-size: 1.4em;
  font-weight: bold;
}

h4 {
  margin: 0;
}

p {
  margin-top: 0;
}
</style>
