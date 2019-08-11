<template>
  <span v-bind:title="date">{{formatted}}</span>
</template>

<script>
import { parse, formatDistance } from "date-fns/esm";
import { toDate, utcToZonedTime, format } from "date-fns-tz";

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
      const timezone = this.$store.state.me.timezone;
      // This seems hacky?
      const parsedDate = toDate(this.date, { timeZone: "UTC" });
      const zonedDate = utcToZonedTime(parsedDate, timezone);
      console.log(parsedDate);
      return zonedDate;
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