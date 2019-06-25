<template>
  <div id="app">
    <Login v-if="!this.loggedIn"/>
    <div v-if="this.loggedIn">
      <UserInfo v-bind:user="this.user"/>
      <SplitCreate />
      <TransactionList />
      <DebtsList />
    </div>
  </div>
</template>

<script>
import Login from './components/Login.vue'
import UserInfo from './components/UserInfo.vue'
import SplitCreate from './components/SplitCreate.vue'
import TransactionList from './components/TransactionList.vue'
import DebtsList from './components/DebtsList.vue'

export default {
  name: 'app',
  computed: {
    loggedIn () {
      return this.$store.state.apiToken !== null;
    }
  },
  components: {
    Login, UserInfo, SplitCreate, TransactionList, DebtsList
  }
}
</script>
