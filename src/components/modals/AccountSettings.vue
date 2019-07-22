<template>
  <div>
    <h3>{{this.$store.state.me.name}}</h3>
    <p>{{this.$store.state.me.email}}</p>
    <p><small>More functionality coming to this screen soon!</small></p>
  </div>
</template>

<script>
import Networker from "../../networking";

export default {
  data() {
    return {
    }
  },

  methods: {

  }
}
</script>
