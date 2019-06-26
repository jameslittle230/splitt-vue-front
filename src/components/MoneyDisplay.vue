<template>
    <span>${{(parseFloat(this.amount)).toFixed(2)}}</span>
</template>

<script>
export default {
    props: ['amount']
}
</script>