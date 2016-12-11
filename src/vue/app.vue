<template>
    <div class="component-app">
        <nav :class="navClasses">
            <div class="float-xs-right">
                <div class="navbar-text">
                    Wind Force: <span>{{ windForce }}</span>
                </div>
                <div class="navbar-text">
                    Clock: <watch></watch>
                </div>
            </div>
        </nav>
        <div class="container-fluid mainContent">
            <div class="row">
                <div class="col-md-3">
                    <battery style="margin-bottom: 1em"></battery>
                    <img class="energyPlate" src="src/icons/energy-plate.svg" @click.stop="generateEnergy" :style="rotate" />
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
    @import "../../node_modules/bootstrap/scss/bootstrap.scss";

    .component-app {
        -webkit-touch-callout: none;
          -webkit-user-select: none;
           -khtml-user-select: none;
             -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
    }

    .component-app .mainContent {
        margin-top: 65px;
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
</style>

<script>
    import { mapGetters } from 'vuex';
    import Inventory from './inventory.vue';
    import Battery from './battery.vue';
    import Crafting from './crafting.vue';
    import Watch from './watch.vue';
    import Energy from './energy.vue';
    import Robots from './robots.vue';
    import dragula from 'dragula';

    const hasClass = (el, className) => {
        const classes = ' ' + el.className + ' ';
        return classes.indexOf(' ' + className + ' ') > -1;
    }

    export default {

        data() {
            return {
                angle: 0
            }
        },

        mounted() {
            dragula([], {
                isContainer: function (el) {
                    return hasClass(el, 'robot-container');
                }
            });
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
            ...mapGetters([
                'isNight'
            ]),

            navClasses() {
                return {
                    navbar: true,
                    'navbar-fixed-top': true,
                    'navbar-dark': this.isNight,
                    'bg-inverse': this.isNight,
                    'bg-faded': !this.isNight,
                }
            },

            rotate() {
                return 'transform: rotate(' + this.angle + 'deg)';
            },

            windForce() {
                return this.$store.state.windForce;
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
