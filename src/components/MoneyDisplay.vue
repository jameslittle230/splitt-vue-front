<template>
    <span>${{(parseInt(this.amount) / 100).toFixed(2)}}</span>
</template>

<script>
export default {
    props: ['amount']
}
</script>