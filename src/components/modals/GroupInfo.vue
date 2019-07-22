<template>
  <div>
    <h2>{{currentGroupName}}</h2>
    <p>
      <code>{{ this.$store.state.currentGroup.name }}@{{ this.$store.state.currentGroup.id.substring(0,8) }}</code>
    </p>
    <h3>{{members.length}} Members</h3>
    <ul>
      <li v-for="member in members" v-bind:key="member.id">
        {{member.name}}
        <small>({{member.email}})</small>
      </li>
    </ul>
    <p>
        <button>Add members</button>
      <button class="destructive-button">Delete Group</button>
    </p>
  </div>
</template>

<script>
import Networker from "../../networking";

export default {
  data() {
    return {
      newGroupName: "",
      newGroupMembers: [""]
    };
  },

  computed: {
    currentGroupName: function() {
      return this.$store.state.currentGroup.name;
    },

    members: function() {
      return this.$store.state.currentGroup.members;
    }
  },

  methods: {}
};
</script>
