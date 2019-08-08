<template>
  <div class="notification">
    <div class="notification-body">{{notification.body}}</div>
    <div class="actions">
      <div class="action close-button" v-on:click="closeNotification">
        <span>&times;</span>
      </div>
      <div
        class="action"
        v-for="action in notification.actions"
        v-bind:key="action.label"
        v-on:click="action.fxn()"
      >
        <span>{{action.label}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["notification"],
  methods: {
    closeNotification: function() {
      this.$store.commit("deletePresentedNotification", this.notification);
    }
  },
  mounted: function() {
    const self = this;
    if (this.notification.timer) {
      setTimeout(function() {
        self.closeNotification();
      }, this.notification.timer * 1000);
    }
  }
};
</script>

<style scoped>
.notification {
  background-color: rgb(255, 255, 255);
  color: black;
  border-radius: 8px;
  border: 2px solid black;
  margin-bottom: 0.5em;
  width: 24em;

  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

.notification-body {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
}

.actions {
  text-align: center;
  border-left: 1px solid black;
  flex-shrink: 0;

  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;

  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/**
 * 1: Make the action fill the whole height of its container
 */

.action {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1; /* 1 */
  min-width: 4rem;
  padding: 1rem;
  cursor: pointer;
}

.action:not(:first-child) {
  border-top: 1px solid black;
}

.close-button {
  font-weight: 300;
  font-size: 2em;
  padding: 0;
}

.action:hover {
  background: hsla(0, 0%, 0%, 0.1);
}

.action:active {
  background: hsla(0, 0%, 0%, 0.2);
}
</style>


