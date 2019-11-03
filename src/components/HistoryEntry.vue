<template>
  <div class="history-entry">
    <div class="icon">{{icon}}</div>
    <div class="info" style="flex-shrink: 0">
      <p>
        <b>{{entry.subject.name !== "" ? entry.subject.name : entry.subject.email}}</b>
        {{readableAction}}
      </p>
      <p class="date">
        <DateDisplay v-bind:date="entry.created_at" />
      </p>
    </div>
    <div class="spacer" style="width: 100%"></div>
    <div class="actions" style="flex-shrink: 0;">
      <button class="lowkey-button" v-on:click="undo" v-if="entryIsUndoable()">Undo</button>
      <!-- <button class="lowkey-button">Edit</button> -->
    </div>
  </div>
</template>

<script>
import Networker from "../networking";
import DateDisplay from "./DateDisplay.vue";

export default {
  props: ["entry"],

  computed: {
    readableAction: function() {
      switch (this.entry.verb) {
        case "createdTransaction":
          return this.entry.object
            ? `created transaction "${this.entry.object.description}"`
            : `created a transaction that has since been deleted.`;
        case "createdReconciliation":
          return this.entry.object
            ? `reconciled ${this.entry.object.splits.length} splits`
            : `created a reconciliation that no longer exists.`;
        case "undidEvent":
          return `did an undo.`;
      }

      return "performed an action";
    },

    icon: function() {
      switch (this.entry.verb) {
        case "createdTransaction":
          return `+`;
        case "createdReconciliation":
          return `✓`;
        case "undidEvent":
          return `↩︎`;
      }

      return "";
    }
  },

  methods: {
    entryIsUndoable() {
      if (!this.$store.state.undoableVerbs) {
        return false;
      }

      if (!this.entry.object) {
        return false;
      }

      return this.$store.state.undoableVerbs.indexOf(this.entry.verb) !== -1;
    },

    undo: function() {
      var self = this;
      Networker.undoEvent(this.entry.id)
        .then(function() {
          self.$store.dispatch("refreshDebts");
          self.$store.dispatch("refreshHistory");
        })
        .catch(function(error) {
          Networker.log(error);
        });
    }
  },

  components: { DateDisplay }
};
</script>

<style scoped>
.history-entry {
  padding: 1rem;
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.3);
  display: flex;
  transition: background-color 0.2s ease-out;
}

.history-entry:hover {
  background-color: hsla(0, 0%, 0%, 0.1);
}

.history-entry:last-of-type {
  border-bottom: none;
}

.icon {
  margin-right: 0.5em;
  font-size: 1.4em;
  font-weight: bold;
}

p {
  margin: 0;
}

.date {
  font-size: 0.9em;
  color: hsla(0, 0%, 0%, 0.4);
}
</style>