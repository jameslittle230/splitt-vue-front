<template>
  <div class="promo-page">
    <div class="top-bar">
      <div>
        <img src="/splitt-logo.svg" style="height: 3em;" />
      </div>
      <div>
        <button v-on:click="showSignUpModal">Sign up</button>
        <button v-on:click="showLoginModal">Log In</button>
      </div>
    </div>
    <div class="main-promo-content">
      <div class="phone-image-container">
        <img src="/iphone.png" alt />
      </div>
      <div>
        <h1 class="title">Splitt</h1>
        <p class="subtitle">by James Little</p>
        <div class="promo-text">
          <p>Splitt keeps track of expenses so you don't have to.</p>
          <p>Get rid of those complicated spreadsheets and start logging your payments and transactions with Splitt. Splitt will keep track of who owes each other money in your friend group, apartment, coworking team or relationship so you can reconcile debts and keep track of group expenses.</p>
        </div>
        <p>
          <button
            style="font-size: 1.4rem"
            v-on:click="showSignUpModal"
          >Start using Splitt online today</button>
        </p>
        <p style="opacity: 0.5">
          <img src="/appstorebadge.svg" style="width: 12rem;" />
          <br />
          <span style="font-size: 0.8em;">iOS app coming soon.</span>
        </p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from "./Footer.vue";
export default {
  methods: {
    showLoginModal: function() {
      this.$store.commit("setOpenModal", "Login");
    },

    showSignUpModal: function() {
      this.$store.commit("setOpenModal", "SignUp");
    }
  },

  components: { Footer }
};
</script>


<style>
.promo-page {
  max-width: 800px;
  margin: 0 auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0 3rem;
}

.main-promo-content {
  display: flex;
}

.phone-image-container {
  flex-shrink: 0;
  width: 40%;
  padding-right: 1.5rem;
}

@media screen and (max-width: 40em) {
  .main-promo-content {
    display: block;
  }

  .phone-image-container {
    display: none;
  }
}

.title {
  font-size: 6rem;
  line-height: 1;
  margin: 0;
  margin-bottom: 0.2rem;
}

.subtitle {
  font-size: 1.6rem;
  font-weight: bold;
  margin: 0;
}

.promo-text {
  font-size: 1.1em;
  line-height: 1.6;
}

.promo-text p {
  margin: 1.5em 0;
}
</style>
