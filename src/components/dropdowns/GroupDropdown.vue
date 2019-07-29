<template>
  <div class="dropdown-wrapper">
    <button
      v-on:click="menuIsVisible = !menuIsVisible"
      v-bind:class="{'active': menuIsVisible}"
    >{{ currentGroupName }} {{ menuIsVisible ? "&times;" : "&#9662;" }}</button>
    <div class="dropdown" v-if="menuIsVisible" v-on-clickaway="clickaway">
      <p class="dropdown-item dropdown-item-no-action">
        Group code:
        <code>{{ currentGroupCode }}</code>
      </p>
      <p class="dropdown-item" v-on:click="showGroupInfoModal">Other group info</p>
      <hr />
      <p class="dropdown-item" v-on:click="showNewGroupModal">+ New Group</p>
      <p class="dropdown-item" v-on:click="showJoinGroupModal">Join Group</p>
      <hr v-if="nonCurrentGroups.length > 0" />
      <p
        class="dropdown-item"
        v-for="group in nonCurrentGroups"
        v-bind:key="group.id"
        v-on:click="selectedGroup = group.id"
      >{{group.name}}</p>
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

  computed: {
    nonCurrentGroups: function() {
      const curr = this.$store.state.currentGroup.id;
      return this.$store.state.me.groups.filter(g => g.id != curr);
    },

    currentGroupName: function() {
      return this.$store.state.currentGroup.name;
    },

    currentGroupCode: function() {
      return (
        this.$store.state.currentGroup.name +
        "@" +
        this.$store.state.currentGroup.id.substring(0, 8)
      );
    },

    selectedGroup: {
      get() {
        return this.$store.state.currentGroupId;
      },
      set(newGroupId) {
        this.$store.dispatch("setGroup", newGroupId);
        this.menuIsVisible = false;
      }
    }
  },

  methods: {
    clickaway: function() {
      this.menuIsVisible = false;
    },

    showGroupInfoModal: function() {
      this.$store.commit('setOpenModal', 'GroupInfo')
    },
    
    showNewGroupModal: function() {
      this.$store.commit('setOpenModal', 'NewGroup')
    },

    showJoinGroupModal: function() {
      this.$store.commit('setOpenModal', 'JoinGroup')
    }
  }
};
</script>

<style scoped>
.dropdown {
  width: 200px;
}
</style>
