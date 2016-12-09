<template>
    <li class="component-energy-item list-group-item" @mouseover="mouseEnter" @mouseleave="mouseLeave">
        <div class="energy">{{ energyAll }}</div>
        <div class="icon-container">
            <div class="icon-wrapper" v-for="n in count">
                <img :src="icon" class="icon" />
            </div>
        </div>
        <tooltip class="tooltip-energy-item" :visible="tooltipVisible">
            <table class="info-table">
                <tbody>
                    <tr>
                        <th>Count:</th>
                        <td>{{ count }}</td>
                    </tr>
                    <tr>
                        <th>Generates (all):</th>
                        <td>{{ energyAll }}</td>
                    </tr>
                    <tr>
                        <th>Generates (single):</th>
                        <td>{{ energySingle }}</td>
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

    .tooltip-energy-item .info-table {
        border-collapse: collapse;
        th, td {
            padding: 0.2em 0.5em;
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

            icon() {
                return item(this.type).icon;
            }
        },

        methods: {
            mouseEnter() {
                if (!this.tooltipVisible) {
                    this.tooltipVisible = true;
                }
            },
            mouseLeave() {
                if (this.tooltipVisible) {
                    this.tooltipVisible = false;
                }
            }
        }

    }
</script>
