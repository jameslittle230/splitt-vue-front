<template>
  <div class="dropdown-wrapper">
    <button
      v-on:click="menuIsVisible = true"
      v-bind:class="{'active': menuIsVisible}"
    >{{ this.$store.state.me.email }} {{ menuIsVisible ? " &times;" : " &#9662;" }}</button>
    <div class="dropdown" v-if="menuIsVisible" v-on-clickaway="clickaway">
      <p class="dropdown-item" v-on:click="showAccountSettingsModal">My Account</p>
      <p class="dropdown-item" v-on:click="logout">Log Out</p>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';

export default {
  data() {
    return {
      menuIsVisible: false
    };
  },

  mixins: [ clickaway ],

  methods: {
    clickaway: function(event) {
      this.menuIsVisible = false;
    },

    showAccountSettingsModal: function() {
      this.$store.commit('setOpenModal', 'AccountSettings')
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
