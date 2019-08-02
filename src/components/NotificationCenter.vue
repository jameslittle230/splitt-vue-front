<template>
  <div class="notification-center">
    <transition-group name="indiv">
      <Notification
        v-for="notification in notifications"
        v-bind:key="notification.timestamp"
        v-bind:notification="notification"
      />
    </transition-group>
  </div>
</template>

<script>
/**
 * Notifications API:
 * 
 * Notification objects can have three properties:
 * - body: string
 * - actions (optional): [action object]
 * - timer (optional): number representing seconds
 * 
 * The body is the text that gets presented in the main part of the notification.
 * Actions are arbitrary functions and associated labels that get displayed below
 * the "close" x. The timer, an optional property, indicates the lifespan of the
 * alert. Without this property, the alert will be present until it is
 * manually closed.
 * 
 * The notification center, through the data store, is set to hold 8 notifications
 * in the stack at a time; once the ninth is pushed on, the oldest gets popped
 * off the stack.
 * 
 * Action objects have two properties:
 * - fxn: The function that gets called when the action is taken
 * - label: The text displayed in the notification that the user presses.
 * 
 ******************************
 * 
 * Example:
 * 
    self.$store.commit("presentNotification", {
      body: "Created your group.",
      actions: [{
        label: "Undo",
        fxn: function() {
          // undo code
        }
      }],
      timer: 10
    });
 *
 *
 */
import Notification from "./Notification.vue";

export default {
  computed: {
    notifications: function() {
      return this.$store.state.presentedNotifications;
    }
  },

  components: { Notification },
};
</script>

<style scoped>
.notification-center {
  position: absolute;
  right: 1em;
  top: 1em;
  z-index: 50;
}

.indiv-enter-active,
.indiv-leave-active,
.indiv-move {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* easeOutQuad */
}

.indiv-enter {
  transform: translateX(100%);
  opacity: 0;
}

.indiv-leave-to {
  opacity: 0;
}
</style>
