<template>
    <div>
        <fieldset style="float: left">
            <legend>Energy</legend>
            <button @click="charge">Charge</button>
        </fieldset>
        <fieldset style="float: left">
            <legend>Resources</legend>
            <crafting></crafting>
        </fieldset>

        <div style="float: right">
            <inventory></inventory>
            <battery></battery>
        </div>
    </div>
</template>

<script>
    import Inventory from '../js/inventory.js';
    import Battery from '../js/battery.js';
    import InventoryVue from './inventory.vue';
    import BatteryVue from './battery.vue';
    import CraftingVue from './crafting.vue';

    export default {

        components: {
            Inventory: InventoryVue,
            Battery: BatteryVue,
            Crafting: CraftingVue
        },

        methods: {
            charge() {
                Battery.charge();
            }
        }
    }
</script>
