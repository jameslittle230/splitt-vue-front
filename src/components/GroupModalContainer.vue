<template>
  <div style="display: flex; justify-content: space-evenly; align-items: center">
    <div style="width: 40%">
      <JoinGroup />
    </div>
    <div><p><i>or</i></p></div>
    <div style="width: 40%;">
      <NewGroup />
    </div>
  </div>
</template>

<script>
import JoinGroup from "./modals/JoinGroup";
import NewGroup from "./modals/NewGroup";

export default {
  components: { JoinGroup, NewGroup }
};
</script>
