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
      <div class="infobutton" v-on:click="showInfoModal">i</div>
    </div>
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
      this.$store.commit("setOpenModal", "AppInfo")
    }
  },

  components: { UserDropdown, GroupDropdown }
};
</script>

<style scoped>
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
  align-items: center;
  justify-content: flex-end;
}

.infobutton {
  height: 1.5rem;
  width: 1.5rem;
  background: hsla(0, 0%, 0%, 0.4);
  text-align: center;
  line-height: 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 50%;
  margin-left: 0.2rem;
  color: hsl(38, 80%, 64%);
  cursor: pointer;
}

.infobutton:hover {
  background: hsla(0, 0%, 0%, 0.7);
}
</style>
