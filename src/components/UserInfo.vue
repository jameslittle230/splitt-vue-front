<template>
    <div class="userinfo">
        <p>Welcome, {{this.$store.state.me.name}}</p>
        <p v-if="this.$store.state.currentGroup">
            Group: {{this.$store.state.currentGroup.name}}
            ({{this.$store.state.me.groups.length}} groups in total)
        </p>
        <p>
            <button @click="this.logout">Log out</button>
            <button>New group (nothing yet)</button>
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