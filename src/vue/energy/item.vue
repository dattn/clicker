<template>
    <li class="component-energy-item list-group-item" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
        <div class="energy">{{ energyAll }}</div>
        <div class="icon-container">
            <div class="icon-wrapper" v-for="n in iconCount" :style="iconWrapperStyle">
                <img :src="icon" class="icon" />
            </div>
        </div>
        <tooltip class="tooltip-energy-item" :visible="tooltipVisible">
            <table class="info-table">
                <tbody>
                    <tr>
                        <th>Count:</th>
                        <td class="text-xs-right">{{ count }}</td>
                    </tr>
                    <tr>
                        <th>Generates (all):</th>
                        <td class="text-xs-right">{{ energyAll }}</td>
                    </tr>
                    <tr>
                        <th>Generates (single):</th>
                        <td class="text-xs-right">{{ energySingle }}</td>
                    </tr>
                </tbody>
            </table>
        </tooltip>
    </li>
</template>

<style lang="sass">
    .component-energy-item .energy {
        float: right;
        font-size: 2em;
    }

    .component-energy-item .icon-container {
        font-size: 3em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: "";
        line-height: 1em;
    }

    .component-energy-item .icon-wrapper {
        display: inline-block;
        overflow: visible;
    }

    .component-energy-item .icon-wrapper .icon {
        height: 1em;
        vertical-align: top;
    }

    .tooltip-energy-item .info-table {
        border-collapse: collapse;
        th, td {
            padding: 0.2em 0.5em;
            white-space: nowrap;
        }
    }
</style>

<script>
    import { item } from '../../js/crafting';
    import Tooltip from '../tooltip.vue';

    const roundNumber = number => Math.round(number * 100) / 100;

    export default {

        props: [ 'type', 'count' ],

        components: { Tooltip },

        data() {
            return {
                tooltipVisible: false
            }
        },

        computed: {
            energyAll() {
                const energy = roundNumber(item(this.type).generate.energy);
                if (energy > 0) {
                    return '+' + energy;
                }
                return energy;
            },

            energySingle() {
                const energy = roundNumber(item(this.type).generate.energy / this.count);
                if (energy > 0) {
                    return '+' + energy;
                }
                return energy;
            },

            iconCount() {
                return Math.min(this.count, 20);
            },

            icon() {
                return item(this.type).icon;
            },

            iconWrapperStyle() {
                return {
                    width: Math.min(1.1, 7 / this.iconCount) + 'em'
                }
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
