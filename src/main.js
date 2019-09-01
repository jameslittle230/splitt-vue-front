import Vue from "vue";
import App from "./App.vue";
import store from "./store.js";
import networking from "./networking";

Vue.config.productionTip = false;

Vue.config.errorHandler = function(err, vm, info) {
  networking.log(err);
};

/* eslint-disable no-new */
new Vue({
  store,
  render: h => h(App),

  beforeCreate() {
    this.$store.dispatch("initialiseStore");
  }
}).$mount("#app");
