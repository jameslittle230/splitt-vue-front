<template>
  <li class="txn-list-item" v-on:mousemove="adjustTooltipPosition($event)">
    <p>
      <b>
        <MoneyDisplay v-bind:amount="split.amount" />
      </b>
      {{split.transaction.description}}
    </p>
    <p class="txn-list-item-subtitle">
      <DateDisplay v-bind:date="getTxnDisplayDate(split.transaction)" format="relative" />&nbsp;•&nbsp;
      <MoneyDisplay v-bind:amount="split.transaction.full_amount" />&nbsp;total
    </p>
    <div class="tooltip" ref="tooltip">
      <h1 class="tooltip-title">{{split.transaction.description}}</h1>
      <p>
        Created on
        <DateDisplay v-bind:date="getTxnDisplayDate(split.transaction)" />
        by {{getGroupMemberName(split.transaction.creator)}}
      </p>
      <p>
        Full amount:
        <MoneyDisplay v-bind:amount="split.transaction.full_amount" />
        ,
        split as {{Math.round(split.percentage * 100)}}%
      </p>
      <p
        class="tooltip-long-description"
        v-html="formatLongDescription(split.transaction.long_description)"
      />
    </div>
  </li>
</template>

<script>
import MoneyDisplay from "./MoneyDisplay";
import DateDisplay from "./DateDisplay";

export default {
  props: ["split"],
  components: { MoneyDisplay, DateDisplay },
  methods: {
    getTxnDisplayDate: function(txn) {
      return txn.altered_date ? txn.altered_date : txn.created_at;
    },

    getGroupMemberName: function(id) {
      return this.$store.state.currentGroup.members.filter(m => m.id == id)[0]
        .name;
    },

    formatLongDescription: function(value) {
      value = value.replace(/(?:\r\n|\r|\n)/g, "<br>");
      return value;
    },

    adjustTooltipPosition: function(event) {
      if (this.$refs.tooltip) {
        this.$refs.tooltip.style.transform = `translateX(${event.clientX}px) translateY(${event.clientY}px)`;
      }
    }
  }
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
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  width: 25em;

  display: none;

  font-size: 0.8em;
  background-color: hsl(213, 63%, 85%);
  padding: 1em;
  color: black;
  box-shadow: 0 0 4px hsla(0, 0%, 0%, 0.7), 0 0 28px hsla(0, 0%, 0%, 0.3);
  font-weight: normal;
  border-radius: 8px;
  border: 2px solid black;
}

.txn-list-item:hover .tooltip {
  display: block;
}

.tooltip-title {
  margin: 0.3em 0;
  font-size: 1.4em;
}

.tooltip p {
  margin-bottom: 0.6em;
}

.tooltip-long-description {
  border-left: 2px solid rgba(0%, 0%, 0%, 60%);
  padding-left: 0.8em;
}
</style>
