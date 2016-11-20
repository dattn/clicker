<template>
    <div>
        <fieldset style="float: left">
            <legend>Energy</legend>
            <button @click="BATTERY_CHARGE">Charge</button>
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
    import { mapMutations } from 'vuex';
    import Inventory from './inventory.vue';
    import Battery from './battery.vue';
    import Crafting from './crafting.vue';

    export default {

        components: {
            Inventory,
            Battery,
            Crafting
        },

        methods: {
            ...mapMutations([
                'BATTERY_CHARGE'
            ])
        }
    }
</script>
