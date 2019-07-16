<template>
  <div class="dropdown-wrapper">
    <button
      v-on:click="menuIsVisible = !menuIsVisible"
      v-bind:class="{'active': menuIsVisible}"
    >{{ this.$store.state.me.email }} {{ menuIsVisible ? " &times;" : " &#9662;" }}</button>
    <div class="dropdown" v-if="menuIsVisible">
      <p class="dropdown-item" v-on:click="showAccountSettingsModal">My Account</p>
      <p class="dropdown-item" v-on:click="logout">Log Out</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuIsVisible: false
    };
  },

  methods: {
    showAccountSettingsModal: function() {
      alert("To do");
    },

    logout: function() {
      this.$store.commit("logout");
    }
  }
};
</script>

<style scoped>
.dropdown {
  width: 8em;
}
</style>
