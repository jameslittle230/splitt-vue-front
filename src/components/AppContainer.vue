<template>
  <div>
    <UserInfo />
    <SplitCreate />
    <DebtsList />
  </div>
</template>

<script>
import UserInfo from "./UserInfo.vue";
import SplitCreate from "./SplitCreate.vue";
import DebtsList from "./DebtsList.vue";

export default {
  components: {
    UserInfo,
    SplitCreate,
    DebtsList
  }
};
</script>
