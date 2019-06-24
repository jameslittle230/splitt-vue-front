<template>
    <div class="login">
        <form action="#" v-on:submit.prevent="submit">
            <p><label for="email">Email: <input type="text" name="email" v-model="email"></label></p>
            <p><label for="password">Password: <input type="password" name="password" id="" v-model="password"></label></p>
            <p><button type="submit">Log in</button></p>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

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
    }
}
</script>