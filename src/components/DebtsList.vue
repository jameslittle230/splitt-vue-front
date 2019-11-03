<template>
  <div v-if="this.$store.state.debts" class="debt-listing-container">
    <div
      v-for="(debt, idx) in debts"
      v-bind:key="idx"
      class="card hover"
      v-bind:class="(debt.net < 0) ? 'red' : 'green'"
      v-on:click="showDebtDetailModal(debt)"
    >
      <div>
        <span v-if="debt.net < 0">
          You owe {{debt.member.displayName}}
          <span class="amount">
            <MoneyDisplay v-bind:amount="debt.net * -1" />
          </span>
        </span>

        <span v-if="debt.net > 0">
          {{debt.member.displayName}} owes you
          <span class="amount">
            <MoneyDisplay v-bind:amount="debt.net" />
          </span>
        </span>
      </div>
      <p class="subtitle">{{debt.created.length + debt.owed.length}} transactions</p>
    </div>
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
    showDebtDetailModal: function(debt) {
      this.$store.commit("setOpenModalWithProps", {
        component: "DebtDetail",
        props: { debt: debt }
      });
    }
  },

  components: { MoneyDisplay }
};
</script>

<style scoped>
.amount {
  font-weight: 900;
}

.debt-listing-container {
  display: flex;
  position: relative;
  flex-basis: 100%;
}

.subtitle {
  color: hsla(0, 0%, 100%, 0.6);
  font-size: 0.6em;
  margin-top: 0.4em;
}
</style>
