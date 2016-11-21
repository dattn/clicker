<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3">
                <div class="energyPlate noselect" @click.stop="BATTERY_CHARGE">Charge</div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        Resources
                    </div>
                    <div class="card-block">
                        <crafting></crafting>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <watch></watch>
                <inventory></inventory>
                <battery></battery>
            </div>
        </div>
    </div>
</template>

<style lang="sass">
    @import "../../node_modules/bootstrap/scss/bootstrap.scss";

    .energyPlate {
        width: 200px;
        height: 200px;
        line-height: 200px;
        text-align: center;

        border: 1px solid #999;
        cursor: pointer;
        background-color: #CCC;
    }

    .noselect {
        -webkit-touch-callout: none;
          -webkit-user-select: none;
           -khtml-user-select: none;
             -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
    }
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
