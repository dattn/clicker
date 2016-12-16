<template>
    <div class="component-app" :style="appStyle">
        <div class="container-fluid mainContent">
            <div class="row">
                <div class="col-md-3">
                    <watch></watch>
                    <battery style="margin-bottom: 1em"></battery>
                    <img class="energyPlate" src="icons/energy-plate.svg" @click.stop="generateEnergy" :style="rotate" />
                    <energy></energy>
                </div>
                <div class="col-md-6">
                    <crafting></crafting>
                </div>
                <div class="col-md-3">
                    <inventory></inventory>
                    <robots></robots>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass">
    @import "../../../node_modules/bootstrap/scss/bootstrap.scss";

    html, body {
        height: 100%;
    }

    .component-app {
        overflow: auto;
        min-height: 100%;

        -webkit-touch-callout: none;
          -webkit-user-select: none;
           -khtml-user-select: none;
             -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
    }

    .component-app .mainContent {
        margin-top: 15px;
    }

    .component-app .navbar.navbar-dark .navbar-text {
        color: #eceeef;
    }

    .component-app .energyPlate {
        display: block;
        width: 200px;
        max-width: 100%;
        margin: 0 auto 1em auto;
        cursor: pointer;
        transition: transform 1s ease-out;
    }

    .component-app {
        .component-layout-watch {
            width: 40%;
        }
    }
</style>

<script>
    import Inventory from '../inventory.vue';
    import Battery from '../battery.vue';
    import Crafting from '../crafting.vue';
    import Energy from '../energy.vue';
    import Robots from '../robots.vue';
    import Color from 'color';
    import Watch from '../layout/watch.vue';
    import { dayLight } from '../../js/utils';
    import { start } from '../../js/loop';

    export default {

        data() {
            return {
                angle: 0
            }
        },

        components: {
            Inventory,
            Battery,
            Crafting,
            Watch,
            Energy,
            Robots
        },

        computed: {
            rotate() {
                return 'transform: rotate(' + this.angle + 'deg)';
            },

            appStyle() {
                const dayColor   = Color('#7EC0EE');
                const nightColor = Color('#001c38');
                const currentColor = dayColor.mix(nightColor, dayLight(this.$store.state.time));

                return {
                    backgroundColor: currentColor.string()
                }
            }
        },

        methods: {
            generateEnergy: function() {
                this.angle += 90;
                this.$store.commit('BATTERY_CHARGE', {});
            }
        }
    }
</script>
