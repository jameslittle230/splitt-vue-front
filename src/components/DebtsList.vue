<template>
    <div>
        <h2>Debts List</h2>
        <ul>
            <li v-for="debt in debts">
                <strong><MoneyDisplay v-bind:amount="debt.amount" />:</strong>
                {{debt.transaction}} ({{debt.percentage}}%)
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
        }
    },

    components: {MoneyDisplay}
}
</script>