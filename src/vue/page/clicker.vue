<template>
    <div class="component-app" :style="appStyle">
        <div class="container-fluid mainContent">
            <div class="row">
                <div class="col-lg-4">
                    <div class="hidden-lg-up">
                        <battery></battery>
                        <img class="energyPlate" src="icons/energy-plate.svg" @click.stop="generateEnergy" :style="rotate" />
                    </div>
                    <div class="row hidden-md-down">
                        <div class="col-lg-6 tree-column">
                            <div>
                                <div class="clearfix">
                                    <watch></watch>
                                    <wind></wind>
                                </div>
                                <tree></tree>
                            </div>
                        </div>
                        <div class="col-lg-6 energy-column">
                            <div>
                                <img class="energyPlate" src="icons/energy-plate.svg" @click.stop="generateEnergy" :style="rotate" />
                                <battery></battery>
                            </div>
                        </div>
                    </div>
                    <energy></energy>
                </div>
                <div class="col-lg-5">
                    <crafting></crafting>
                </div>
                <div class="col-lg-3">
                    <inventory></inventory>
                    <robots></robots>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="sass">
    $enable-flex: true;

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

        transition: background-color 1s linear;
        background: url(layout/background.svg) center top no-repeat;
        background-size: 100%;

        @include media-breakpoint-down(md) {
            background-image: none;
        }
    }

    .component-app .mainContent {
        margin-top: 15px;
    }

    .component-app .navbar.navbar-dark .navbar-text {
        color: #eceeef;
    }

    .component-app .energyPlate {
        display: block;
        width: 60%;
        margin: 0 auto;
        cursor: pointer;
        transition: transform 1s ease-out;
    }

    .component-app {
        .component-layout-watch {
            width: 40%;
            float: left;
        }

        .component-energy {
            margin-top: 2vw;
        }

        .component-layout-wind {
            width: 40%;
            float: right;
        }

        .component-layout-battery {
            margin: 0.8em 0 0 0;
        }

        .component-layout-tree {
            width: 40%;
            margin: 0 auto;

            img {
                margin-top: -2vw;

                @include media-breakpoint-down(md) {
                    margin-top: -2vw * 4;
                }
            }
        }

        .component-inventory,
        .component-crafting {
            margin-top: 12vw;
        }

        .tree-column,
        .energy-column {
            display: flex;
            align-items: flex-end;
            justify-content: center;

            &> div {
                width: 100%;
            }
        }
    }
</style>

<script>
    import Inventory from '../inventory.vue';
    import Battery from '../layout/battery.vue';
    import Crafting from '../crafting.vue';
    import Energy from '../energy.vue';
    import Robots from '../robots.vue';
    import Color from 'color';
    import Watch from '../layout/watch.vue';
    import Wind from '../layout/wind.vue';
    import Tree from '../layout/tree.vue';
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
            Wind,
            Energy,
            Tree,
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
