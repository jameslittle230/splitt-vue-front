<template>
    <div>
        <h2>New Split</h2>
        <form action="#" method="post" v-on:submit.prevent="submit">
            $<input 
                type="text"
                v-model="amount"
                v-on:blur="inputIsFocused = false"
                v-on:focus="inputIsFocused = true">
            <p v-if="active">
                <label for="memo">Memo: <input type="text" name="memo" v-model="memo"></label>&nbsp;
                <button type="submit">Create Split</button>
            </p>
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
            amount: "",
            memo: "",
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
            var currentGroup = this.$store.state.currentGroup;
            currentGroup = "6e29436e-32d1-47e8-9c17-f037dc1910f7";
            a.request({
                url: `/groups/${currentGroup}/transactions`,
                method: 'post',
                data: {
                    full_amount: this.amount,
                    description: this.memo,
                },
                params: {
                    api_token: this.$store.state.apiToken
                }
            }).then(function(response) {
                console.log(response.data);
                self.$store.commit('addTransaction', response.data);
            }).catch(function(error) {
                console.error(error);
            })
        }
    }
}
</script>