<template>
  <div>
    <h3>Join an Existing Group</h3>
    <form action="#" method="POST" v-on:submit.prevent="submit">
      <label for="name">
        Code:
        <input type="text" name="name" ref="name" v-model="joinCode" />
      </label>
      <p class="form-error-message" v-if="message">{{ message }}</p>
      <p>
        <button
          type="submit"
          v-bind:disabled="submitButtonDisabled"
        >{{ submitButtonDisabled ? "..." : "Join Group" }}</button>
      </p>
    </form>
  </div>
</template>

<script>
import Networker from "../../networking";

export default {
  data() {
    return {
      joinCode: "",
      message: "",
      submitButtonDisabled: false,
    };
  },

  methods: {
    reset: function() {
      this.joinCode = "";
      this.submitButtonDisabled = false;
      this.$refs.name.focus();
    },

    submit: function() {
      const self = this;

      this.submitButtonDisabled = true;
      Networker.groupSearch(this.joinCode)
        .then(function(response) {
          Networker.addSelfToGroup(response.data[0].id).then(function(
            response
          ) {
            self.$store.dispatch("refreshMe");
            self.$store.dispatch("setGroup", response.data.group.id);
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
    }
  },

  mounted: function() {
    this.$refs.name.focus();
  }
};
</script>
