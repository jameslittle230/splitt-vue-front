<template>
    <div v-if="txns">
        <h2>{{ txns.length }} Transaction{{txns.length == 1 ? "" : "s"}}</h2>
        <ul>
            <li v-for="transaction in txns">
                <strong><MoneyDisplay v-bind:amount="transaction.full_amount" />:</strong>
                {{transaction.description}}
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';
import MoneyDisplay from './MoneyDisplay';

const a = axios.create({
    baseURL: 'http://back.test/api/'
})

export default {
    data() {
        return {
            email: "1@gmail.com",
            password: "qwerty",
        }
    },

    computed: {
        txns: function() {
            return this.$store.state.me.transactions
        }
    },

    methods: {
        submit: function() {
            var self = this;
            a.post('/login', {
                email: this.email,
                password: this.password
            }).then(function(response) {
                self.$store.commit('setApiKey', response.data.api_token);
            }).catch(function(error) {
                console.error(error);
            })
        }
    },

    components: {MoneyDisplay},
}
</script>