<template>
  <li class="txn-list-item">
    <p>
      <b>
        <MoneyDisplay v-bind:amount="split.amount" />
      </b>
      {{split.transaction.description}}
    </p>
    <p class="txn-list-item-subtitle">
      <DateDisplay v-bind:date="split.transaction.created_at" /> • <MoneyDisplay v-bind:amount="split.transaction.full_amount" /> total
    </p>
    <div
      class="tooltip"
      v-if="split.transaction.long_description"
    >{{split.transaction.long_description}}</div>
  </li>
</template>

<script>
import MoneyDisplay from "./MoneyDisplay";
import DateDisplay from "./DateDisplay";

export default {
  props: ["split"],
  components: { MoneyDisplay, DateDisplay }
};
</script>


<style scoped>
.txn-list-item {
  position: relative;
  margin-bottom: 0.8em;
}

.txn-list-item b {
  font-size: 1.1em;
}

.txn-list-item p {
  margin: 0;
}

.txn-list-item-subtitle {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8em;
  color: hsla(0, 0%, 0%, 0.7);
}

.tooltip {
  position: absolute;
  top: 0;
  left: 10%;
  z-index: 5;
  display: none;

  font-size: 0.8em;
  background-color: hsl(213, 63%, 65%);
  padding: 1em;
  color: white;
  text-shadow: 1px 1px 1px black;
  box-shadow: 0 0 4px hsla(0, 0%, 0%, 0.7), 0 0 28px hsla(0, 0%, 0%, 0.3);
  font-weight: bold;
  border-radius: 8px;
  border: 2px solid black;
}

.txn-list-item:hover .tooltip {
  display: block;
}
</style>
