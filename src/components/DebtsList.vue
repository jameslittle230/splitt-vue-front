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
        <button v-on:click="reconcile(debt.id)">Paid</button>
      </li>
    </ul>
    <p v-if="debts.length == 0">No debts yet!</p>
  </div>
</template>

<script>
import axios from "axios";
import MoneyDisplay from "./MoneyDisplay";

const a = axios.create({
  baseURL: "http://back.test/api/"
});

export default {
  computed: {
    debts: function() {
      if(!this.$store.state.currentGroup) { return null }
      const myId = this.$store.state.me.id;

      const txns = this.$store.state.currentGroup.transactions
      const notMyTxns = txns.filter(txn => txn.creator != myId)
      const mySplits = notMyTxns.map(function(txn) {
        const mySplitList = txn.splits.filter(split => split.debtor == myId)
        return mySplitList.length == 1 ? mySplitList[0] : null;
      });
      return mySplits.filter(split => split && (split.reconciled == 0));
    },

    groupMembers: function() {
      if(!this.$store.state.currentGroup) { return null }
      var output = [];
      for (const member of this.$store.state.currentGroup.members) {
        output[member.id] = member;
      }
      return output;
    },

    txns: function() {
      if(!this.$store.state.currentGroup) { return null }
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

  methods: {
    reconcile: function(splitId) {
      var self = this;
      a.request({
        url: `/splits/${splitId}`,
        method: "put",
        data: {
          reconciled: 1,
        },
        params: {
          api_token: this.$store.state.apiToken
        }
      })
        .then(function(response) {
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