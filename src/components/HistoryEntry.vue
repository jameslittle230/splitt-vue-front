<template>
  <div class="history-entry">
    <div class="icon">Icon</div>
    <div class="info">
      <p>
        <b>{{entry.subject.name !== "" ? entry.subject.name : entry.subject.email}}</b>
        {{readableVerb}} "{{readableObject}}"
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
    readableVerb: function() {
      switch (this.entry.verb) {
        case "createdTransaction":
          return "created transaction";
          break;
        case "createdReconciliation":
          return "reconciled splits";
      }
    },

    readableObject: function() {
      switch (this.entry.verb) {
        case "createdTransaction":
          return this.entry.object.description;
          break;
        case "createdReconciliation":
          return this.entry.object.id;
      }
    }
  },

  components: { DateDisplay }
};
</script>

<style scoped>
.history-entry {
  padding: 1em 0;
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.3);
  display: flex;
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
  color: hsla(0, 0%, 0%, 0.7);
}
</style>