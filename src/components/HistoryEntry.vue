<template>
  <div class="history-entry">
    <!-- <div class="icon">Icon</div> -->
    <div class="info">
      <p>
        <b>{{entry.subject.name !== "" ? entry.subject.name : entry.subject.email}}</b>
        {{readableAction}}
      </p>
      <p class="date">
        <DateDisplay v-bind:date="entry.created_at" />
      </p>
    </div>
  </div>
</template>

<script>
import DateDisplay from "./DateDisplay.vue";

export default {
  props: ["entry"],

  computed: {
    readableAction: function() {
      switch (this.entry.verb) {
        case "createdTransaction":
          return `created transaction "${this.entry.object.description}"`;
          break;
        case "createdReconciliation":
          return `reconciled ${this.entry.object.splits.length} splits`;
      }
    }
  },

  components: { DateDisplay }
};
</script>

<style scoped>
.history-entry {
  padding: 1rem 0;
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.3);
  display: flex;
  font-size: 0.9em;
  opacity: 0.7;
  transition: opacity 0.2s ease-out;
}

.history-entry:hover {
  opacity: 1;
}

.history-entry:last-of-type {
  border-bottom: none;
}

.icon {
  margin-right: 0.5em;
  font-style: italic;
}

p {
  margin: 0;
}

.date {
  font-size: 0.9em;
  color: hsla(0, 0%, 0%, 0.4);
}
</style>