<template>
  <div class="layout-wrapper">
    <div class="name">
      <h1>Welcome, {{this.$store.state.me.name}}</h1>
      <p v-if="myGroups && myGroups.length == 0">
        <span style="margin-right: 0.5em">You're not a member of any groups.</span>
        <button v-on:click="showNewGroupModal">Let's change that.</button>
      </p>
    </div>
    <div class="userinfo">
      <GroupDropdown v-if="this.$store.state.currentGroup" />
      <UserDropdown />
    </div>
  </div>
</template>

<script>
import Networker from "../networking";
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
    }
  },

  components: { UserDropdown, GroupDropdown }
};
</script>

<style>
.layout-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: top;
  padding-top: 1em;
}

h1 {
  margin: 0;
}

.userinfo {
  text-align: right;
  flex-grow: 2;
  display: flex;
  justify-content: flex-end;
}
</style>
