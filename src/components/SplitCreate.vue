<template>
    <div>
        <h2>New Split</h2>
        $<input 
            type="text"
            v-model="amount"
            v-on:blur="inputIsFocused = false"
            v-on:focus="inputIsFocused = true">
        <p v-if="active">
            <label for="memo">Memo: <input type="text" name="memo"></label>&nbsp;
            <button type="submit">Create Split</button>
        </p>
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
            amount: "",
            inputIsFocused: false
        }
    },

    computed: {
        active: function() {
            return (this.amount != "") || this.inputIsFocused;
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