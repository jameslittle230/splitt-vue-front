<template>
    <div v-if="this.$store.state.currentGroup">
        <h2>New Split</h2>
        <form action="#" method="post" v-on:submit.prevent="submit">
            $<VueNumeric  
                separator=","
                v-bind:precision="2"
                v-bind:min="0" v-bind:max="100000"
                v-model="amount"
                v-on:blur="inputIsFocused = false"
                v-on:focus="inputIsFocused = true" />
            <p v-if="active">
                <label for="memo">Memo: <input type="text" name="memo" v-model="memo"></label>&nbsp;
                <button type="submit">Create Split</button>
            </p>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import VueNumeric from 'vue-numeric';

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

    components: {VueNumeric},

    methods: {
        submit: function() {
            var self = this;
            var currentGroup = this.$store.state.currentGroupId;
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
                self.$store.commit('addTransaction', response.data);
                self.amount = "";
                self.memo = "";
                self.inputIsFocused = false;
            }).catch(function(error) {
                console.error(error);
            })
        }
    }
}
</script>