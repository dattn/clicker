<template>
    <div class="component-battery">
        <div class="battery">
            <div class="energy" :style="energyStyle"></div>
            <span class="info">{{ energy }} / {{ capacity }}</span>
        </div>
    </div>
</template>

<style>
    .component-battery .battery {
        border: 1px solid #000;
        height: 50px;
        width: 100%;
        position: relative;
        line-height: 50px;
        text-align: center;
        background-color: #fff;
    }

    .component-battery .battery .energy {
        position: absolute;
        height: 100%;
        top: 0px;
        left: 0px;
        transition: background-color 1s linear, width 0.2s linear;
    }

    .component-battery .battery .info {
        position: relative;
        z-index: 1;
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
