<template>
  <li class="txn-list-item" v-on:mousemove="adjustTooltipPosition($event)">
    <p>
      <b>
        <MoneyDisplay v-bind:amount="split.amount" />
      </b>
      {{split.transaction.description}}
    </p>
    <p class="txn-list-item-subtitle">
      <DateDisplay
        v-bind:date="txnDisplayDate"
        format="relative"
        v-bind:timezoned="txnShouldBeZoned"
      />&nbsp;•&nbsp;
      <MoneyDisplay v-bind:amount="split.transaction.full_amount" />&nbsp;total
    </p>
    <div class="tooltip" ref="tooltip">
      <h1 class="tooltip-title">{{split.transaction.description}}</h1>
      <p>
        {{ this.split.transaction.altered_date ? "Date adjusted to" : "Created on" }}
        <DateDisplay v-bind:date="txnDisplayDate" v-bind:timezoned="txnShouldBeZoned" />
        by {{transactionCreatorDisplayName}}
      </p>
      <p>
        Full amount:
        <MoneyDisplay v-bind:amount="split.transaction.full_amount" />
        ,
        split as {{Math.round(split.percentage * 100)}}%
      </p>
      <p class="tooltip-long-description" v-if="longDescription" v-html="longDescription" />
    </div>
  </li>
</template>

<script>
import MoneyDisplay from "./MoneyDisplay";
import DateDisplay from "./DateDisplay";

export default {
  props: ["split"],
  components: { MoneyDisplay, DateDisplay },

  computed: {
    txnDisplayDate: function() {
      const txn = this.split.transaction;
      return txn.altered_date ? txn.altered_date : txn.created_at;
    },

    txnShouldBeZoned: function() {
      // If there's an altered date, the transaction display should not be
      // adjusted for the time zone, since the altered date represents
      // the beginning of the listed day in whatever timezone the user is in
      return !this.split.transaction.altered_date;
    },

    longDescription: function() {
      var value = this.split.transaction.longDescription;
      if (!value) {
        return "";
      }
      var doc = new DOMParser().parseFromString(value, "text/html");
      value = doc.body.textContent || "";
      value = value.replace(/(?:\r\n|\r|\n)/g, "<br>");
      return value;
    },

    transactionCreatorDisplayName: function() {
      const txnCreatorId = this.split.transaction.creator;
      const creatorObject = this.$store.state.currentGroup.members.filter(
        m => m.id == txnCreatorId
      )[0];
      if (creatorObject) {
        return creatorObject.displayName;
      }
      return "";
    }
  },

  methods: {
    adjustTooltipPosition: function(event) {
      const self = this;
      if (this.$refs.tooltip) {
        requestAnimationFrame(function() {
          self.$refs.tooltip.style.transform = `translateX(${event.clientX}px) translateY(${event.clientY}px)`;
        });
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
