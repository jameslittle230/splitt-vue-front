<template>
  <div>
    <h3>Create a New Group</h3>
    <form action="#" method="POST" v-on:submit.prevent="submitNewGroupForm">
      <p>
        <label for="name">
          Name:
          <input type="text" name="name" v-model="newGroupName" />
        </label>
      </p>
      <p>
        <i>Member 1: {{this.$store.state.me.email}}</i>
      </p>
      <p v-for="(email, idx) in newGroupMembers" v-bind:key="idx">
        <label v-bind:for="`email${idx}`">
          Email of Member {{idx + 2}}:
          <input
            type="email"
            v-bind:name="`email${idx}`"
            v-model="newGroupMembers[idx]"
          />
          <button v-on:click="newGroupMembers.splice(idx, 1);" v-if="idx != 0">x</button>
        </label>
      </p>
      <p>
        <button v-on:click="newGroupMembers.push('')">Add Someone Else</button>
      </p>
      <p>
        <button type="submit">Create Group</button>
      </p>
    </form>
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

  methods: {
    submitNewGroupForm: function() {
      const self = this;
      Networker.createNewGroup(
        this.newGroupName,
        this.newGroupMembers.filter(x => x != "")
      )
        .then(function(response) {
          self.$store.dispatch("refreshMe").then(function() {
            self.$store.dispatch("setGroup", response.data.group.id);
            self.$store.commit("clearOpenModal");
            // And toast?
          });
        })
        .catch(function(error) {
          Networker.log(error);
        });
    }
  }
};
</script>
