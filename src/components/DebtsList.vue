<template>
    <div>
        <h2>Debts List</h2>
        <ul>
            <li v-for="debt in debts">
                <strong>{{debt.amount}}</strong>
                {{debt.transaction}} ({{debt.percentage}}%)
            </li>
        </ul>
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

    computed: {
        debts: function() {
            return this.$store.state.me.splits
        }
    },

    methods: {
    }
}
</script>