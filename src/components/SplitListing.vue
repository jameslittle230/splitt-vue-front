<template>
  <li class="txn-list-item" v-on:mousemove="adjustTooltipPosition($event)">
    <div>
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
        />
      </p>
    </div>

    <div class="buttons">
      <button>Details</button>
      <button>Edit</button>
      <button class="destructive-button">Delete</button>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buttons {
  font-size: 0.8em;
  visibility: hidden;
  flex-shrink: 0;
}

.txn-list-item:hover .buttons {
  visibility: visible;
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
</style>
