<template>
  <div v-if="txns">
    <h2>{{ numberOfTxns }} Transaction{{numberOfTxns == 1 ? "" : "s"}}</h2>
    <input type="radio" id="mine" value="mine" v-model="txnFilter">
    <label for="mine">mine</label>
    <input type="radio" id="all" value="all" v-model="txnFilter">
    <label for="all">all</label>
    <ul>
      <li
        v-for="transaction in txns"
        v-bind:key="transaction.id"
        v-bind:class="{mine: txnIsMine(transaction)}"
      >
        <strong>
          <MoneyDisplay v-bind:amount="transaction.full_amount"/>:
        </strong>
        {{transaction.description}}
        <small v-bind:title="transaction.created_at">
          <i>{{transaction.created_at | datefmt}}</i>
        </small>
      </li>
    </ul>
  </div>
</template>

<script>
import MoneyDisplay from "./MoneyDisplay";
import DateFmt from "../filters/Datefmt";

export default {
  data() {
    return {
      email: "1@gmail.com",
      password: "qwerty",
      txnFilter: "mine"
    };
  },

  computed: {
    txns: function() {
      if (!this.$store.state.currentGroup) {
        return null;
      }
      var txns = [...this.$store.state.currentGroup.transactions].reverse();
      return txns.filter(t => this.txnFilterAllows(t));
    },

    numberOfTxns: function() {
      return this.txns.length;
    }
  },

  methods: {
    txnIsMine: function(txn) {
      return txn.creator === this.$store.state.me.id;
    },

    txnFilterAllows: function(txn) {
      switch (this.txnFilter) {
        case "mine":
          return this.txnIsMine(txn);
          break;
        case "all":
          return true;
          break;
        default:
          // throw error
          return false;
      }
    }
  },

  filters: {
    datefmt: DateFmt
  },

  components: { MoneyDisplay }
};
</script>

<style scoped>
.mine {
  color: #af7139;
}
</style>
