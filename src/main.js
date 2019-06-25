import Vue from 'vue'
import App from './App.vue'
import store from './store.js'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  render: h => h(App),

  beforeCreate() {
    this.$store.commit('initialiseStore');
    console.log("Got here")
	}
}).$mount('#app')
