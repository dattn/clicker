<template>
    <div>
        <div v-for="resource in resources" class="resource" @click="craft(resource)">
            {{ resource.label }} ( <span v-for="require in resource.requires">{{ require.type }}: {{ require.count }}</span> )
        </div>
    </div>
</template>

<style>
    .resource {
        border: 1px solid #999;
        padding: 10px;
        cursor: pointer;
        background-color: #CCC;
    }

    .resource:not(:last-child) {
        margin-bottom: 10px;
    }
</style>

<script>
    import Inventory from '../js/inventory.js';
    import Battery from '../js/battery.js';

    export default {

        data() {
            return {
                resources: [
                    {
                        type: 'wood',
                        label: 'Wood',
                        requires: [
                            { type: 'energy', count: 10 }
                        ]
                    },
                    {
                        type: 'stone',
                        label: 'Stone',
                        requires: [
                            { type: 'energy', count: 20 }
                        ]
                    },
                    {
                        type: 'iron',
                        label: 'Iron',
                        requires: [
                            { type: 'energy', count: 30 }
                        ]
                    }
                ]
            }
        },

        methods: {

            craft(resource) {
                for (var i = 0; i < resource.requires.length; i++) {
                    if (resource.requires[i].type === 'energy') {
                        if (!Battery.disCharge(resource.requires[i].count)) {
                            return;
                        }
                    }
                }

                if (!Inventory[resource.type]) {
                    this.$set(Inventory, resource.type, 0);
                }
                Inventory[resource.type]++;
            }

        }

    }
</script>
