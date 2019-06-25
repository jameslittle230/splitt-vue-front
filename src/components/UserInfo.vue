<template>
    <div class="userinfo">
        <p>Welcome, {{this.$store.state.me.name}}</p>
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

    methods: {
        logout: function() {
            this.$store.commit('logout');
        }
    }
}
</script>