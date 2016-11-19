<template>
    <table>
        <tr v-for="(count, type) in inventory">
            <td>{{ type }}</td>
            <td>{{ count }}</td>
        </tr>
    </table>
</template>

<script>
    import Inventory from '../js/inventory.js';

    export default {
        data() {
            return {
                inventory: Inventory
            }
        }
    }
</script>
