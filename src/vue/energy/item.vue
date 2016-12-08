<template>
    <li class="component-energy-item list-group-item">
        <div class="energy">{{ energy(type) }}</div>
        <div class="icon-container">
            <div class="icon-wrapper" v-for="n in count">
                <img :src="item(type).icon" class="icon" />
            </div>
        </div>
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

    export default {

        props: [ 'type', 'count' ],

        methods: {
            item,

            energy(type) {
                const energy = Math.round(item(type).generate.energy * 100) / 100;
                if (energy > 0) {
                    return '+' + energy;
                }
                return energy;
            }
        }

    }
</script>
