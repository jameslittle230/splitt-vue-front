<template>
  <div>
    <UserInfo />
    <SplitCreate />
    <div class="grid">
      <DebtsList />
      <History />
    </div>
    <Footer />
  </div>
</template>

<script>
import UserInfo from "./UserInfo.vue";
import SplitCreate from "./SplitCreate.vue";
import DebtsList from "./DebtsList.vue";
import History from "./History.vue";
import Footer from "./Footer.vue";

export default {
  components: {
    UserInfo,
    SplitCreate,
    DebtsList,
    History,
    Footer
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 60% 1fr;
  grid-column-gap: 2em;
}

@media screen and (max-width: 40rem) {
  .grid {
    display: block;
  }
}
</style>

