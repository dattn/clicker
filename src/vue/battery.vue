<template>
    <div>
        <div class="battery">
            <div :class="classes" :style="style"></div>
            <span>{{ energy }} / {{ capacity }}</span>
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
        background-color: green;
        transition: background-color 1s linear, width 0.2s linear;
        z-index: -1;
    }

    .battery .energy.medium {
        background-color: yellow;
    }

    .battery .energy.low {
        background-color: red;
    }
</style>

<script>
    import { mapGetters } from 'vuex';

    export default {

        computed: {
            ...mapGetters([
                'capacity',
                'energy'
            ]),

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
                return 'width: ' + this.percentage + '%';
            }
        }
    }
</script>
