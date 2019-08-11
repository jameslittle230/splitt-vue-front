<template>
  <div>
    <div class="layout-wrapper">
      <img src="/splitt-logo.svg" class="logo" />
      <div class="user-info">
        <GroupDropdown v-if="this.$store.state.currentGroup" />
        <UserDropdown />
        <img src="/info.svg" alt class="info-button" v-on:click="showInfoModal" />
      </div>
    </div>
    <p v-if="myGroups && myGroups.length == 0" class="intro-text">
      <span style="margin-right: 0.5em">You're not a member of any groups.</span>
      <button v-on:click="showNewGroupModal">Let's change that.</button>
    </p>
  </div>
</template>

<script>
import UserDropdown from "./dropdowns/UserDropdown.vue";
import GroupDropdown from "./dropdowns/GroupDropdown.vue";

export default {
  data() {
    return {};
  },

  computed: {
    myGroups: function() {
      return this.$store.state.me.groups;
    }
  },

  methods: {
    showNewGroupModal: function() {
      this.$store.commit("setOpenModal", "GroupModalContainer");
    },

    showInfoModal: function() {
      this.$store.commit("setOpenModal", "AppInfo");
    }
  },

  components: { UserDropdown, GroupDropdown }
};
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1em;
}

.logo {
  height: 2.5em;
  margin-bottom: 0.4em;
}

h1 {
  margin: 0;
}

.user-info {
  text-align: right;
  flex-grow: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.user-info > * {
  margin-bottom: 0.2em;
}

.info-button {
  margin-left: 0.2rem;
  cursor: pointer;
  width: 1.5em;
  opacity: 0.5;
}

.info-button:hover {
  opacity: 0.8;
}

.intro-text {
  font-size: 2em;
  margin: 2em 0;
  font-weight: bold;
}

.intro-text button {
  display: block;
  margin-top: 0.3em;
  font-size: 0.8em;
}

@media screen and (max-width: 40rem) {
  .layout-wrapper {
    display: block;
  }

  .user-info {
    /* display: block; */
    text-align: left;
    justify-content: flex-start;
  }
}
</style>
