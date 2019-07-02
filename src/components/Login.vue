<template>
  <div class="login">
    <h2>Log In</h2>
    <form action="#" method="POST" v-on:submit.prevent="submit">
      <p>
        <label for="email">
          Email:
          <input type="text" name="email" v-model="email">
        </label>
      </p>
      <p>
        <label for="password">
          Password:
          <input type="password" name="password" id v-model="password">
        </label>
      </p>
      <p>
        <button type="submit">Log in</button>
      </p>
    </form>
  </div>
</template>

<script>
import Networker from '../networking';

export default {
  data() {
    return {
      email: "j@gmail.com",
      password: "asdf"
    };
  },

  methods: {
    submit: function() {
      var self = this;
      Networker.login(this.email, this.password)
        .then(function(response) {
          self.$store.dispatch("postLogin", response.data);
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  }
};
</script>