<template>
  <div v-if="this.$store.state.currentGroup">
    <h2>
      Debts List (You owe
      <MoneyDisplay v-bind:amount="debtTotal"/>)
    </h2>
    <ul>
      <li v-for="debt in debts" v-bind:key="debt.id">
        You owe {{ groupMembers[txns[debt.transaction].creator].name }}
        <strong>
          <MoneyDisplay v-bind:amount="debt.amount"/>
        </strong>
        for
        {{txns[debt.transaction].description}}
        <span
          v-if="debt.percentage != 100"
        >({{debt.percentage}}%)</span>
        <button v-on:click="reconcile(debt.id)">Paid (not wired yet)</button>
      </li>
    </ul>
    <p v-if="debts.length == 0">No debts yet!</p>
  </div>
</template>

<script>
import MoneyDisplay from "./MoneyDisplay";

export default {
  computed: {
    debts: function() {
      const myId = this.$store.state.me.id;
      return this.$store.state.currentGroup.transactions
        .filter(txn => txn.creator != myId)
        .map(txn => txn.splits.filter(split => split.debtor == myId)[0]);
    },

    groupMembers: function() {
      var output = [];
      for (const member of this.$store.state.currentGroup.members) {
        output[member.id] = member;
      }
      return output;
    },

    txns: function() {
      var output = [];
      for (const txn of this.$store.state.currentGroup.transactions) {
        output[txn.id] = txn;
      }
      return output;
    },

    debtTotal: function() {
      const sum = (accumulator, currentValue) => accumulator + currentValue;
      if (this.debts.length < 1) {
        return 0;
      }

      return this.debts.map(split => parseFloat(split.amount)).reduce(sum);
    }
  },

  components: { MoneyDisplay }
};
</script>