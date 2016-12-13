<template>
    <div>
        <div class="battery">
            <div :class="classes" :style="style"></div>
            <span class="info">{{ energy }} / {{ capacity }}</span>
        </div>
    </div>
</template>

<style>
    .battery {
        border: 1px solid #000;
        height: 50px;
        width: 100%;
        position: relative;
        line-height: 50px;
        text-align: center;
    }

    .battery .energy {
        position: absolute;
        height: 100%;
        top: 0px;
        left: 0px;
        transition: background-color 1s linear, width 0.2s linear;
    }

    .battery .info {
        position: relative;
        z-index: 1;
    }
</style>

<script>
    import { mapGetters } from 'vuex';
    import { redToGreen } from '../js/colors';

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

            classes() {
                return {
                    energy: true,
                    low: this.percentage <= 20,
                    medium: this.percentage > 20 && this.percentage <= 50
                }
            },

            style() {
                return {
                    width: this.percentage + '%',
                    backgroundColor: redToGreen(this.percentage)
                }
            }
        }
    }
</script>
