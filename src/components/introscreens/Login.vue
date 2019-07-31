<template>
  <div class="login">
    <h2>Log In</h2>

    <form v-on:submit.prevent="submit">
      <p>
        <label for="email">
          Email:
          <input type="text" name="email" v-model="email" ref="email" />
        </label>
      </p>
      <p>
        <label for="password">
          Password:
          <input type="password" name="password" v-model="password" ref="password" />
        </label>
      </p>
      <p class="message" v-if="message">{{ message }}</p>
      <p>
        <button
          type="submit"
          v-bind:disabled="submitButtonDisabled"
        >{{ submitButtonDisabled ? "..." : "Log in" }}</button>
      </p>
    </form>
  </div>
</template>

<script>
import Networker from "../../networking";

function firstWhereOrLast(collection, callback) {
  for (let index = 0; index < collection.length; index++) {
    const element = collection[index];
    if (callback(element)) {
      return element;
    }
  }

  return collection[collection.length - 1];
}

export default {
  data() {
    return {
      email: "",
      password: "",
      message: "",
      submitButtonDisabled: false
    };
  },

  methods: {
    reset: function() {
      this.message = "";
      this.email = "";
      this.password = "";
      this.submitButtonDisabled = false;
      this.$refs.email.focus();
    },

    submit: function() {
      var self = this;

      this.message = "";

      if (this.email == "" || this.password == "") {
        this.message = "Please fill out both username and password.";

        const focusTarget = firstWhereOrLast(
          [
            { ref: this.$refs.email, val: this.email },
            { ref: this.$refs.password, val: this.password }
          ],
          v => v.val == ""
        ).ref;

        focusTarget.focus();
        return;
      }

      this.submitButtonDisabled = true;

      Networker.login(this.email, this.password)
        .then(function(response) {
          self.$store.dispatch("postLogin", response.data);
        })
        .catch(function(error) {
          if (error.response.status == "403") {
            self.reset();
            self.message = "Incorrect credentials. Try again.";
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
    this.$refs.email.focus();
  }
};
</script>

<style scoped>
.message {
  background-color: rgb(155, 69, 68);
  padding: 20px;
  color: white;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
  border-radius: 8px;
  border: 2px solid black;
}
</style>
