<template>
  <div id="app">
    <Login v-if="this.loggedIn"/>
    {{ this.$store.state.apiToken }}
  </div>
</template>

<script>
import Login from './components/Login.vue'

export default {
  name: 'app',
  computed: {
    loggedIn () {
      return this.$store.state.apiToken == null;
    }
  },
  components: {
    Login
  }
}
</script>
