<template>
    <table class="table table-sm">
        <tr v-for="(count, type) in inventory">
            <th scope="row">{{ type }}</th>
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
