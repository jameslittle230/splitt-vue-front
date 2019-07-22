<template>
  <div>
    <h3>Join an Existing Group</h3>
    <form action="#" method="POST" v-on:submit.prevent="submitJoinGroupForm">
      <label for="name">
        Code:
        <input type="text" name="name" v-model="joinCode" />
      </label>
      <p>
        <button type="submit">Join Group</button>
      </p>
    </form>
  </div>
</template>

<script>
import Networker from "../../networking";

export default {
  data() {
    return {
      joinCode: ""
    };
  },

  methods: {
    submitJoinGroupForm: function() {
      const self = this;
      Networker.groupSearch(this.joinCode)
        .then(function(response) {
          Networker.addSelfToGroup(response.data[0].id)
            .then(function(response) {
              self.$store.dispatch("refreshMe");
              self.$store.dispatch("setGroup", response.data.group.id);
              self.resetGroupCreationBox();
            })
            .catch(function(error) {
              console.log("Inner Error");
              console.log(error);
            });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
