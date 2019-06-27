<template>
    <div class="userinfo">
        <h1>Welcome, {{this.$store.state.me.name}}</h1>
        <p v-if="this.$store.state.currentGroup">
            Group:
            <select v-model="selectedGroup">
                <option disabled value="">Please select one</option>
                <option 
                    v-for="group in myGroups"
                    v-bind:key="group.id"
                    v-bind:value="group.id"
                >{{group.name}}</option>
            </select>
        </p>
        <p>
            <button @click="this.logout">Log out</button>
            <button v-on:click="isCreatingNewGroup = true">New group</button>
        </p>

        <div v-if="isCreatingNewGroup" style="border: 1px dashed black; padding: 20px;">
            <button v-on:click="isCreatingNewGroup = false">nvm</button>
            <form action="#" method="POST" v-on:submit.prevent="submitNewGroupForm">
                <p><label for="name">Name: <input type="text" name="name" v-model="newGroupName"></label></p>
                <p><i>Member 1: {{this.$store.state.me.email}}</i></p>
                <p v-for="(email, idx) in newGroupMembers" v-bind:key="idx">
                    <label v-bind:for="`email${idx}`">Email of Member {{idx + 2}}: 
                        <input type="email" v-bind:name="`email${idx}`" v-model="newGroupMembers[idx]">
                        <button v-on:click="newGroupMembers.splice(idx, 1);">x</button>
                    </label>
                </p>
                <p><button v-on:click="newGroupMembers.push('')">Add Someone Else</button></p>
                <p><button type="submit">Create a Group</button></p>
            </form>
        </div>

        <p v-if="postGroupCreationMessage" style="background-color: #DA5A57">{{postGroupCreationMessage}}</p>
    </div>
</template>

<script>
import axios from 'axios';

const a = axios.create({
    baseURL: 'http://back.test/api/'
})

export default {
    data() {return {
        isCreatingNewGroup: false,
        newGroupName: "",
        newGroupMembers: [""],
        postGroupCreationMessage: null,
    }},

    computed: {
        myGroups: function() {
            return this.$store.state.me.groups;
        },

        selectedGroup: {
            get () {
                return this.$store.state.currentGroupId
            },
            set (newGroupId) {
                this.$store.dispatch('setGroup', newGroupId)
            }
        }
    },

    methods: {
        logout: function() {
            this.$store.commit('logout');
        },

        resetGroupCreationBox: function() {
            this.isCreatingNewGroup = false;
            this.newGroupName = "";
            this.newGroupMembers = [""];
        },

        submitNewGroupForm: function() {
            const self = this;
            a.request({
                url: `/groups`,
                method: 'post',
                data: {
                    name: this.newGroupName,
                    members: this.newGroupMembers.filter(x => x != ""),
                },
                params: {
                    api_token: this.$store.state.apiToken
                }
            }).then(function(response) {
                self.postGroupCreationMessage = `Group "${response.data.name}" has been created.`
                self.resetGroupCreationBox();
            }).catch(function(error) {
                console.error(error);
            })
        }
    }
}
</script>