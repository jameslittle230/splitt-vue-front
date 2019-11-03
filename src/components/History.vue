<template>
  <div v-if="this.$store.state.history">
    <h4>Event History</h4>
    <p v-if="this.$store.state.history.length == 0">No events yet!</p>
    <HistoryEntry
      v-for="event in this.$store.state.history"
      v-bind:key="event.id"
      v-bind:entry="event"
    />
    <!-- <div class="history-entry" style="padding: 1rem; text-align: center;">
      <button>See more &rarr;</button>
    </div>-->
  </div>
</template>

<script>
import HistoryEntry from "./HistoryEntry.vue";

export default {
  computed: {},

  methods: {},

  components: { HistoryEntry }
};
</script>