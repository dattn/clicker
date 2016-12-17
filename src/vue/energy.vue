<template>
    <ul class="component-energy list-group energy-items">
        <energy-item v-for="(count, type) in items" :type="type" :count="count"></energy-item>
    </ul>
</template>

<script>
    import { fromCategory } from '../js/crafting';
    import EnergyItem from './energy/item.vue';

    export default {
        components: {
            EnergyItem
        },

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
        }
    }
</script>
