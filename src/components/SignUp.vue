<template>
  <div class="login">
    <h2>Or Sign Up</h2>
    <form action="#" method="POST" v-on:submit.prevent="submit">
      <p>
        <label for="name">
          Name:
          <input type="text" name="name" v-model="name">
        </label>
      </p>
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
        <button type="submit">Sign Up</button>
      </p>
    </form>
  </div>
</template>

<script>
import networking from '../networking';

export default {
  data() {
    return {
      name: "",
      email: "",
      password: ""
    };
  },

  methods: {
    submit: function() {
      var self = this;
      Networker.createUser(this.name, this.email, this.password)
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