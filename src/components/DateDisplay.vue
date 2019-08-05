<template>
  <span v-bind:title="date">{{formatted}}</span>
</template>

<script>
import { parse, format, formatDistance } from "date-fns/esm";

export default {
  props: {
    date: String,
    format: {
      type: String,
      default: "formatted"
    }
  },

  computed: {
    dateObject: function() {
      return parse(this.date, "yyyy-MM-dd HH:mm:ss", new Date());
    },

    formatted: function() {
      if (this.format == "relative") {
        return formatDistance(this.dateObject, new Date(), { addSuffix: true });
      } else {
        return format(this.dateObject, "EEE, MMM dd, yyyy");
      }
    }
  }
};
</script>