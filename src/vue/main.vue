<template>
    <div>
        <nav :class="navClasses">
            <div class="navbar-text float-xs-right">
                <watch></watch>
            </div>
        </nav>
        <div class="container-fluid mainContent">
            <div class="row">
                <div class="col-md-3">
                    <battery style="margin-bottom: 1em"></battery>
                    <img class="energyPlate" src="src/icons/energy-plate.svg" @click.stop="generateEnergy" :style="rotate" />
                </div>
                <div class="col-md-6">
                    <crafting></crafting>
                </div>
                <div class="col-md-3">
                    <inventory></inventory>
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

    .navbar {
        transition: background-color 2s linear;
    }

    .navbar.navbar-dark .navbar-text {
        color: #eceeef;
    }

    .energyPlate {
        display: block;
        width: 200px;
        max-width: 100%;
        margin: 0 auto 1em auto;
        cursor: pointer;
        transition: transform 1s ease-out;
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

        data() {
            return {
                angle: 0
            }
        },

        components: {
            Inventory,
            Battery,
            Crafting,
            Watch
        },

        computed: {
            night() {
                return this.$store.state.time < 60 * 8
                    || this.$store.state.time >= 60 * 20;
            },

            navClasses() {
                return {
                    navbar: true,
                    'navbar-fixed-top': true,
                    'navbar-dark': this.night,
                    'bg-inverse': this.night,
                    'bg-faded': !this.night,
                }
            },

            rotate() {
                return 'transform: rotate(' + this.angle + 'deg)';
            }
        },

        methods: {
            generateEnergy: function() {
                this.angle += 360;
                this.$store.commit('BATTERY_CHARGE', {});
            }
        }
    }
</script>
