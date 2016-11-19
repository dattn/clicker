<template>
    <div>
        <div class="battery">
            <div :class="classes" :style="style"></div>
        </div>
        <span>{{ charged }} / {{ Battery.capacity }}</span>
    </div>
</template>

<style>
    .battery {
        border: 1px solid #000;
        height: 200px;
        width: 100px;
        position: relative;
    }

    .battery .charged {
        position: absolute;
        width: 100%;
        bottom: 0px;
        left: 0px;
        background-color: green;
    }

    .battery .charged.medium {
        background-color: yellow;
    }

    .battery .charged.low {
        background-color: red;
    }
</style>

<script>
    import Battery from '../js/battery.js';

    export default {

        data() {
            return { Battery };
        },

        computed: {

            charged() {
                return Math.round((this.Battery.charged / this.Battery.capacity) * 100);
            },

            classes() {
                return {
                    charged: true,
                    low: this.charged <= 20,
                    medium: this.charged > 20 && this.charged <= 50
                }
            },

            style() {
                return 'height: ' + this.charged + '%';
            }
        }
    }
</script>
