<template>
    <div class="userinfo">
        <p>Welcome, {{this.$store.state.me.name}}</p>
        <p v-if="txns">{{ txns.length }} transaction{{txns.length == 1 ? "" : "s"}}</p>
        <p>
            <button @click="this.logout">Log out</button>
        </p>
    </div>
</template>

<script>
import axios from 'axios';

const a = axios.create({
    baseURL: 'http://back.test/api/'
})

export default {
    data() {return {}},

    computed: {
        txns: function() {
            return this.$store.state.me.transactions
        }
    },

    methods: {
        logout: function() {
            this.$store.commit('logout');
            console.log("ahhhh");
        }
    }
}
</script>