<template>
    <div v-if="this.$store.state.currentGroup">
        <h2>Debts List</h2>
        <ul>
            <li v-for="debt in debts" v-bind:key="debt.id">
                <strong><MoneyDisplay v-bind:amount="debt.amount" />:</strong>
                <!-- {{debt.transaction}} -->
                {{txns[debt.transaction].description}} ({{debt.percentage}}%)
            </li>
        </ul>
    </div>
</template>

<script>
import MoneyDisplay from './MoneyDisplay';

export default {
    computed: {
        debts: function() {
            return this.$store.state.me.splits
        },

        txns: function() {
            var output = [];
            for (const txn of this.$store.state.currentGroup.transactions) {
                output[txn.id] = txn;
            }
            return output;
        }
    },

    components: {MoneyDisplay}
}
</script>