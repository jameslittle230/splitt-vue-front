<template>
  <span v-bind:title="date">{{formatted}}</span>
</template>

<script>
import { parse, format, formatRelative } from "date-fns/esm";

export default {
  props: ["date"],

  computed: {
    dateObject: function() {
      return parse(this.date, "yyyy-MM-dd HH:mm:ss", new Date());
    },

    relative: function() {
      return formatRelative(this.dateObject, new Date());
    },

    formatted: function() {
      return format(this.dateObject, 'EEE, MMM dd, yyyy');
    }
  }
};
</script>