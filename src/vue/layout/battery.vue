<template>
    <div class="component-layout-battery">
        <img src="layout/battery.svg" />
        <div class="battery">
            <div class="energy" :style="energyStyle"></div>
        </div>
        <div class="info">{{ energy }} / {{ capacity }}</div>
    </div>
</template>

<style lang="sass">
    @import "../../../node_modules/bootstrap/scss/variables.scss";
    @import "../../../node_modules/bootstrap/scss/mixins/_breakpoints.scss";

    .component-layout-battery {
        position: relative;

        img {
            width: 100%;
        }

        .info {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            font-size: 1.2vw;

            @include media-breakpoint-down(sm) {
                font-size: 1.2vw * 4;
            }
        }

        .battery {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            padding: 2.5% 5.5% 2.5% 2.5%;

            .energy {
                height: 100%;
                top: 0px;
                left: 0px;
                transition: background-color 1s linear, width 0.2s linear;
            }
        }
    }
</style>

<script>
    import { mapGetters } from 'vuex';
    import Color from 'color';

    export default {

        computed: {
            ...mapGetters([
                'capacity'
            ]),

            energy() {
                return Math.floor(this.$store.state.energy);
            },

            percentage() {
                return Math.round((this.energy / this.capacity) * 100);
            },

            energyStyle() {
                const green  = Color('#83B23E');
                const yellow = Color('#E9B718');
                const red    = Color('#C20E1A');

                var color = red;
                if (this.percentage <= 50) {
                    color = yellow.mix(red, this.percentage / 50);
                } else {
                    color = green.mix(yellow, (this.percentage - 50) / 50);
                }

                return {
                    width: this.percentage + '%',
                    backgroundColor: color.string()
                }
            }
        }
    }
</script>
