<template>
  <div class="login">
    <h2>Sign Up for Splitt</h2>
    <p>
      Or
      <a href="#" v-on:click.prevent="showLoginModal">log in to your account</a>
    </p>
    <form action="#" v-on:submit.prevent="submit">
      <p>
        <label for="name">
          Name:
          <input type="text" name="name" v-model="name" ref="name" />
        </label>
      </p>
      <p>
        <label for="email">
          Email:
          <input type="text" name="email" v-model="email" ref="email" />
        </label>
      </p>
      <p>
        <label for="password">
          Password:
          <input type="password" name="password" id v-model="password" ref="password" />
        </label>
      </p>
      <p class="form-error-message" v-if="message">{{ message }}</p>
      <p>
        <button
          type="submit"
          v-bind:disabled="submitButtonDisabled"
        >{{ submitButtonDisabled ? "..." : "Create Account" }}</button>
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
      name: "",
      email: "",
      password: "",
      message: "",
      submitButtonDisabled: false
    };
  },

  methods: {
    reset: function() {
      this.message = "";
      this.name = "";
      this.email = "";
      this.password = "";
      this.submitButtonDisabled = false;
      this.$refs.name.focus();
    },

    submit: function() {
      var self = this;

      this.message = "";

      if (this.email == "" || this.password == "" || this.name == "") {
        this.message = "Please fill out name, username and password.";

        const focusTarget = firstWhereOrLast(
          [
            { ref: this.$refs.name, val: this.name },
            { ref: this.$refs.email, val: this.email },
            { ref: this.$refs.password, val: this.password }
          ],
          v => v.val == ""
        ).ref;

        focusTarget.focus();
        return;
      }

      this.submitButtonDisabled = true;

      Networker.createUser(this.name, this.email, this.password)
        .then(function(response) {
          self.$store.dispatch("postLogin", response.data);
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

    showLoginModal: function() {
      this.$store.commit("setOpenModal", "Login");
    }
  },

  mounted: function() {
    this.$refs.name.focus();
  }
};
</script>