<template>
    <div class="login">
        <form action="#" method="POST" v-on:submit.prevent="submit">
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
            email: "1561495840@gmail.com",
            password: "asdf",
        }
    },

    methods: {
        submit: function() {
            var self = this;
            a.post('/login', {
                email: this.email,
                password: this.password
            }).then(function(response) {
                self.$store.dispatch('postLogin', response.data);
            }).catch(function(error) {
                console.error(error);
            })
        }
    }
}
</script>