<template>
    <ul class="list-group energy-items">
        <li class="list-group-item" v-for="(count, type) in items">
            <div class="energy">{{ energy(type) }}</div>
            <div class="icon-container">
                <div class="icon-wrapper" v-for="n in count">
                    <img :src="item(type).icon" class="icon" />
                </div>
            </div>
        </li>
    </ul>
</template>

<style>
    .energy-items .energy {
        float: right;
        font-size: 2em;
    }

    .energy-items .icon-container {
        padding: 0 0.5em 0.5em 0;
        line-height: 0.5ex;
        font-size: 3em;
    }

    .energy-items .icon-wrapper {
        display: inline-block;
        height: 0.5em;
        width: 0.5em;
        overflow: visible;
    }

    .energy-items .icon-wrapper .icon {
        height: 1em;
    }
</style>

<script>
    import { item, fromCategory } from '../js/crafting';

    export default {
        computed: {
            items() {
                const items = fromCategory('energy');
                var energy = {};
                for (let i = 0; i < items.length; i++) {
                    if (this.$store.state.items[items[i].type]) {
                        energy[items[i].type] = this.$store.state.items[items[i].type];
                    }
                }
                return energy;
            }
        },

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
