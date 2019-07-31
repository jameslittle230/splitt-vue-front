<template>
  <div>
    <div class="layout-wrapper">
      <img src="/splitt-logo.svg" style="height: 2.5rem;" />
      <div class="userinfo">
        <GroupDropdown v-if="this.$store.state.currentGroup" />
        <UserDropdown />
        <img src="/info.svg" alt class="infobutton" v-on:click="showInfoModal" />
      </div>
    </div>
    <p v-if="myGroups && myGroups.length == 0">
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

h1 {
  margin: 0;
}

.userinfo {
  text-align: right;
  flex-grow: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.infobutton {
  margin-left: 0.2rem;
  cursor: pointer;
  width: 1.5em;
  opacity: 0.5;
}

.infobutton:hover {
  opacity: 0.8;
}
</style>
