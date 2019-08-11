<template>
  <span v-bind:title="date">{{formatted}}</span>
</template>

<script>
import { parse, formatDistance } from "date-fns/esm";
import { toDate, utcToZonedTime, format } from "date-fns-tz";

export default {
  props: {
    date: String,
    timezoned: {
      type: Boolean,
      default: true
    },
    format: {
      type: String,
      default: "formatted"
    }
  },

  computed: {
    dateObject: function() {
      const timezone = this.$store.state.me.timezone;
      var parsedDate = toDate(this.date, {
        timeZone: this.timezoned ? "UTC" : timezone
      });
      if (this.timezoned) {
        parsedDate = utcToZonedTime(parsedDate, timezone);
      }
      return parsedDate;
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