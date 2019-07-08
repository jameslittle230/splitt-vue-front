<template>
  <div class="userinfo">
    <h1>Welcome, {{this.$store.state.me.name}}</h1>
    
    <div v-if="this.$store.state.currentGroup">
    <p>
      Group:
      <select v-model="selectedGroup">
        <option disabled value>Please select one</option>
        <option
          v-for="group in myGroups"
          v-bind:key="group.id"
          v-bind:value="group.id"
        >{{group.name}}</option>
      </select>
    </p>
    
    <p>Group code: <code>{{ this.$store.state.currentGroup.name }}@{{ this.$store.state.currentGroup.id.substring(0,8) }}</code></p>
    
    <p>
      <button @click="this.logout">Log out</button>
      <button v-on:click="isCreatingNewGroup = !isCreatingNewGroup">
        {{isCreatingNewGroup ? "Never mind" : "New group or Join Group"}}
      </button>
    </p>

    </div>

    <div style="display: flex;" v-if="isCreatingNewGroup">
      <!--
        @TODO: Extract these friends into their own components
        @TODO: Form validation
      -->
      <div style="border: 1px dashed black; padding: 20px; margin-right: 20px;">
        <h3>Create a New Group</h3>
        <form action="#" method="POST" v-on:submit.prevent="submitNewGroupForm">
          <p>
            <label for="name">
              Name:
              <input type="text" name="name" v-model="newGroupName">
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
              >
              <button 
                v-on:click="newGroupMembers.splice(idx, 1);"
                v-if="idx != 0">x</button>
            </label>
          </p>
          <p>
            <button v-on:click="newGroupMembers.push('')">Add Someone Else</button>
          </p>
          <p>
            <button type="submit">Create a Group</button>
          </p>
        </form>
      </div>



      <div style="border: 1px dashed black; padding: 20px; margin-right: 20px;">
        <h3>Join an Existing Group</h3>
        <form action="#" method="POST" v-on:submit.prevent="submitJoinGroupForm">
          <label for="name">
            Code:
            <input type="text" name="name" v-model="joinCode">
          </label>
          <p>
            <button type="submit">Join Group</button>
          </p>
        </form>
      </div>

      <div style="border: 1px dashed black; padding: 20px" v-if="this.$store.state.currentGroup">
        <h3>Add people to {{ this.$store.state.currentGroup.name }}</h3>
        <p><i>Coming soon</i></p>
      </div>
    </div>

    <p
      v-if="postGroupCreationMessage"
      style="background-color: #DA5A57; padding: 20px; color: white; text-shadow: 1px 1px 1px black; font-weight: bold; border-radius: 8px; border: 1px solid black;"
    >{{postGroupCreationMessage}}</p>
  </div>
</template>

<script>
import Networker from "../networking";

export default {
  data() {
    return {
      isCreatingNewGroup: false,
      newGroupName: "",
      newGroupMembers: [""],
      postGroupCreationMessage: null,

      joinCode: "",
    };
  },

  computed: {
    myGroups: function() {
      return this.$store.state.me.groups;
    },

    selectedGroup: {
      get() {
        return this.$store.state.currentGroupId;
      },
      set(newGroupId) {
        this.$store.dispatch("setGroup", newGroupId);
      }
    }
  },

  methods: {
    logout: function() {
      this.$store.commit("logout");
    },

    resetGroupCreationBox: function() {
      this.isCreatingNewGroup = false;
      this.newGroupName = "";
      this.newGroupMembers = [""];
    },

    submitNewGroupForm: function() {
      const self = this;
      Networker.createNewGroup(this.newGroupName, this.newGroupMembers.filter(x => x != ""))
        .then(function(response) {
          self.postGroupCreationMessage = `Group "${
            response.data.group.name
          }" has been created.`;
          
          // @TODO: This and the same pattern below (line 172) need to be
          // made synchronous, since refreshMe makes an async call then
          // sets the group itself.
          self.$store.dispatch('refreshMe');
          self.$store.dispatch('setGroup', response.data.group.id);
          self.resetGroupCreationBox();
        })
        .catch(function(error) {
          console.error(error);
        });
    },

    submitJoinGroupForm: function() {
      const self = this;
      Networker.groupSearch(this.joinCode)
        .then(function(response) {
          Networker.addSelfToGroup(response.data[0].id)
          .then(function(response) {
            self.$store.dispatch('refreshMe');
            self.$store.dispatch('setGroup', response.data.group.id);
            self.resetGroupCreationBox();
          })
          .catch(function(error) {
            console.log("Inner Error");
            console.log(error);
          })
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
};
</script>