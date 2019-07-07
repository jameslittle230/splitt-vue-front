<template>
  <div v-if="this.$store.state.currentGroup">
    <h2>Debts</h2>
    
    <details v-for="memberObject in debts">
      <summary v-if="memberObject.net < 0">
        You owe {{memberObject.member.name}} 
        <MoneyDisplay v-bind:amount="memberObject.net * -1" />
      </summary>
      
      <summary v-if="memberObject.net > 0">
        {{memberObject.member.name}} owes you 
        <MoneyDisplay v-bind:amount="memberObject.net" />
      </summary>

      <h4>You owe {{memberObject.member.name}} <MoneyDisplay v-bind:amount="memberObject.owedTotal" /></h4>
      <ul>
        <li v-for="split in memberObject.owed">
          <MoneyDisplay v-bind:amount="split.amount" />: {{split.transaction.description}}
        </li>
      </ul>

      <h4>{{memberObject.member.name}} owes you <MoneyDisplay v-bind:amount="memberObject.createdTotal" /></h4>
      <ul>
        <li v-for="split in memberObject.created">
          <MoneyDisplay v-bind:amount="split.amount" />: {{split.transaction.description}}
        </li>
      </ul>
    </details>
  </div>
</template>

<script>
import Networker from "../networking";
import MoneyDisplay from "./MoneyDisplay";

export default {
  computed: {
    debts: function() {
      return this.$store.state.debts
    },

    groupMembers: function() {
      return this.$store.state.currentGroup.members
    },

    txns: function() {
      return this.$store.state.currentGroup.transactions
    },
  },

  methods: {
    reconcile: function(splitId) {
      var self = this;
      Networker.reconcileSplit(splitId)
        .then(function() {
          // oof I love functional programming
          const txnIdOfReconciledSplit = self.debts
            .filter(split => split.id == splitId)[0].transaction

          self.$store.state.currentGroup.transactions
            .filter(txn => txn.id == txnIdOfReconciledSplit)[0]
            .splits.filter(split => split.id == splitId)[0]
            .reconciled = 1;
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  },

  components: { MoneyDisplay }
};
</script>