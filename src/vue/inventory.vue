<template>
    <table>
        <tr v-for="(count, type) in inventory">
            <td>{{ type }}</td>
            <td>{{ count }}</td>
        </tr>
    </table>
</template>

<script>
    export default {
        computed: {
            inventory() {
                return this.$store.state.inventory;
            }
        }
    }
</script>
