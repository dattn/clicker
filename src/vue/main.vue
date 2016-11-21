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
            <watch></watch>
            <inventory></inventory>
            <battery></battery>
        </div>
    </div>
</template>

<style lang="sass">
    @import "../../node_modules/bootstrap/scss/bootstrap.scss"
</style>

<script>
    import { mapMutations } from 'vuex';
    import Inventory from './inventory.vue';
    import Battery from './battery.vue';
    import Crafting from './crafting.vue';
    import Watch from './watch.vue';

    export default {

        components: {
            Inventory,
            Battery,
            Crafting,
            Watch
        },

        methods: {
            ...mapMutations([
                'BATTERY_CHARGE'
            ])
        }
    }
</script>
