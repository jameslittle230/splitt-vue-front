<template>
  <div>
    <h2 style="margin-bottom:">Create a New Group</h2>
    <p>
      <em>
        Or
        <a href v-on:click.prevent="openJoinGroupModal">join an existing group.</a>
      </em>
    </p>
    <form action="#" v-on:submit.prevent="submit">
      <p style="margin-bottom: 2em;">
        <label for="name">
          Name:
          <input type="text" name="name" ref="name" v-model="newGroupName" />
        </label>
        <br />
        <small>
          <i>A group name can only have lower case letters and dashes.</i>
        </small>
      </p>
      <p>Member 1 Email: {{this.$store.state.me.email}}</p>
      <p v-for="(email, idx) in newGroupMembers" v-bind:key="idx">
        <label v-bind:for="`email${idx}`">
          Member {{idx + 2}} Email:
          <input
            type="email"
            v-bind:name="`email${idx}`"
            v-model="newGroupMembers[idx]"
          />
          <button
            type="button"
            class="lowkey-button"
            style="font-size: 0.7em;"
            v-on:click="newGroupMembers.splice(idx, 1);"
            v-if="idx != 0"
          >x</button>
        </label>
      </p>
      <p>
        <button
          type="button"
          class="lowkey-button"
          v-on:click="newGroupMembers.push('')"
        >Add Someone Else</button>
      </p>
      <p class="form-error-message" v-if="message">{{ message }}</p>
      <p>
        <button
          type="submit"
          v-bind:disabled="submitButtonDisabled"
        >{{ submitButtonDisabled ? "..." : "Create Group" }}</button>
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
      newGroupMembers: [""],
      message: "",
      submitButtonDisabled: false
    };
  },

  methods: {
    reset: function() {
      this.message = "";
      this.newGroupName = "";
      this.newGroupMembers = [""];
      this.submitButtonDisabled = false;
      this.$refs.name.focus();
    },

    submit: function() {
      const self = this;
      this.message = "";

      if (this.name == "" || this.newGroupMembers == [""]) {
        this.message =
          "Please enter a group name or an additional group member.";
        return;
      }

      this.submitButtonDisabled = true;

      Networker.createNewGroup(
        this.newGroupName,
        this.newGroupMembers.filter(x => x != "")
      )
        .then(function(response) {
          self.$store.dispatch("refreshMe").then(function() {
            self.$store.dispatch("setGroup", response.data.group.id);
            self.$store.commit("clearOpenModal");
            self.$store.commit("presentNotification", {
              body: `Group ${self.newGroupName} created.`,
              timer: 10
            });
          });
        })
        .catch(function(error) {
          if (error.response.status == 400) {
            self.reset();
            self.message = error.response.data.message;
          } else {
            Networker.log(error);
          }
        })
        .finally(function() {
          self.submitButtonDisabled = false;
        });
    },

    openJoinGroupModal: function() {
      this.$store.commit("setOpenModal", "JoinGroup");
    }
  },

  mounted: function() {
    this.$refs.name.focus();
  }
};
</script>
