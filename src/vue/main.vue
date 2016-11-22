<template>
    <div>
        <nav class="navbar navbar-dark bg-faded navbar-fixed-top">
            <div class="navbar-text float-xs-right">
                <watch></watch>
            </div>
        </nav>
        <div class="container-fluid mainContent">
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
                    <battery style="margin-bottom: 1em"></battery>
                    <div class="card">
                        <div class="card-header">
                            Inventory
                        </div>
                        <div class="card-block">
                            <inventory></inventory>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass">
    @import "../../node_modules/bootstrap/scss/bootstrap.scss";

    .mainContent {
        margin-top: 65px;
    }

    .energyPlate {
        width: 200px;
        max-width: 100%;
        height: 200px;
        line-height: 200px;
        text-align: center;
        margin: 0 auto 1em auto;

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
