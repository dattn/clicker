<template>
    <li class="component-energy-item list-group-item" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
        <div class="energy">{{ energy }}</div>
        <div class="icon-container">
            <div class="icon-wrapper" v-for="n in count">
                <img :src="icon" class="icon" />
            </div>
        </div>
        <tooltip :visible="tooltipVisible">
            <div>
                Charging: {{ energy }}
            </div>
            <div>
                Count: {{ count }}
            </div>
        </tooltip>
    </li>
</template>

<style>
    .component-energy-item .energy {
        float: right;
        font-size: 2em;
    }

    .component-energy-item .icon-container {
        padding: 0 0.5em 0.5em 0;
        line-height: 0.5ex;
        font-size: 3em;
    }

    .component-energy-item .icon-wrapper {
        display: inline-block;
        height: 0.5em;
        width: 0.5em;
        overflow: visible;
    }

    .component-energy-item .icon-wrapper .icon {
        height: 1em;
    }
</style>

<script>
    import { item } from '../../js/crafting';
    import Tooltip from '../tooltip.vue';

    export default {

        props: [ 'type', 'count' ],

        components: { Tooltip },

        data() {
            return {
                tooltipVisible: false
            }
        },

        computed: {
            energy() {
                const energy = Math.round(item(this.type).generate.energy * 100) / 100;
                if (energy > 0) {
                    return '+' + energy;
                }
                return energy;
            },

            icon() {
                return item(this.type).icon;
            }
        },

        methods: {
            mouseEnter() {
                this.tooltipVisible = true;
            },
            mouseLeave() {
                this.tooltipVisible = false;
            }
        }

    }
</script>
