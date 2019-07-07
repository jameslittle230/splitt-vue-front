<template>
  <div id="app">
    <div v-if="!this.loggedIn">
      <Login />
      <hr>
      <SignUp />
    </div>
    <div v-if="this.loggedIn">
      <UserInfo />
      <SplitCreate />
      <!-- <TransactionList /> -->
      <DebtsList />
    </div>
  </div>
</template>

<script>
import Login from './components/Login.vue'
import SignUp from './components/SignUp.vue'
import UserInfo from './components/UserInfo.vue'
import SplitCreate from './components/SplitCreate.vue'
// import TransactionList from './components/TransactionList.vue'
import DebtsList from './components/DebtsList.vue'

export default {
  name: 'app',
  computed: {
    loggedIn () {
      return this.$store.state.apiToken !== null;
    }
  },
  components: {
    Login, UserInfo, SplitCreate, DebtsList, SignUp
  }
}
</script>
