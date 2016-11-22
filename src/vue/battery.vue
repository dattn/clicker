<template>
    <div>
        <div class="battery">
            <div :class="classes" :style="style"></div>
        </div>
        <span>{{ energy }} / {{ capacity }}</span>
    </div>
</template>

<style>
    .battery {
        border: 1px solid #000;
        height: 200px;
        width: 100px;
        position: relative;
    }

    .battery .energy {
        position: absolute;
        width: 100%;
        bottom: 0px;
        left: 0px;
        background-color: green;
        transition: background-color 1s, height 1s;
    }

    .battery .energy.medium {
        background-color: yellow;
    }

    .battery .energy.low {
        background-color: red;
    }
</style>

<script>
    export default {

        computed: {

            energy() {
                return this.$store.state.battery.energy;
            },

            capacity() {
                return this.$store.state.battery.capacity;
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
                return 'height: ' + this.percentage + '%';
            }
        }
    }
</script>
