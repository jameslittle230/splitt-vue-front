<template>
  <div>
    <h2>
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
    </h2>

    <div class="details">
      <p>
        <button v-on:click="reconcile(debt.member.id); closeModal();">Mark as Paid</button>
      </p>

      <h3 v-if="debt.owedTotal > 0 && debt.createdTotal > 0">
        You owe {{debt.member.displayName}}
        <MoneyDisplay v-bind:amount="debt.owedTotal" />
      </h3>

      <ul v-if="debt.owedTotal > 0">
        <SplitListing v-for="split in debt.owed" v-bind:key="split.id" v-bind:split="split" />
      </ul>

      <h3 v-if="debt.createdTotal > 0 && debt.owedTotal > 0">
        {{debt.member.displayName}} owes you
        <MoneyDisplay v-bind:amount="debt.createdTotal" />
      </h3>

      <ul v-if="debt.createdTotal > 0">
        <SplitListing v-for="split in debt.created" v-bind:key="split.id" v-bind:split="split" />
      </ul>
    </div>
  </div>
</template>

<script>
import Networker from "../../networking.js";
import MoneyDisplay from "../MoneyDisplay.vue";
import SplitListing from "../SplitListing.vue";

export default {
  data() {
    return {
      feedback: ""
    };
  },

  props: {
    debt: Object
  },

  methods: {
    reconcile: function(memberId) {
      var self = this;
      Networker.reconcileDebt(this.$store.state.currentGroupId, memberId)
        .then(function() {
          self.$store.dispatch("refreshDebts");
          self.$store.dispatch("refreshHistory");
        })
        .catch(function(error) {
          Networker.log(error);
        });
    },

    closeModal: function() {
      this.$store.commit("clearOpenModal");
    }
  },

  components: { MoneyDisplay, SplitListing }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
</style>