<template>
    <div class="component-crafting-item card-block robot-container">
        <h3 class="card-title float-xs-left">
            <img :src="item.icon" class="icon" /> {{ item.label }}
        </h3>
        <div class="float-xs-right item-info">
            <p class="requirements">
                <span v-if="item.requires.energy" class="requirement">
                    <img src="icons/energy.svg" class="icon" /> x {{ formatEnergy(item.requires.energy) }}
                </span>
                <span v-for="(amount, type) in item.requires.resources" class="requirement">
                    <img :src="icon(type)" class="icon" /> x {{ amount }}
                </span>
            </p>
            <button class="btn btn-primary" @click="craft(item.type)" :disabled="!canCraft(item.type)">Craft</button>
        </div>
        <robot-container :type="item.type" v-if="showRobots"></robot-container>
    </div>
</template>

<style>
    .component-crafting-item .icon {
        height: 2em;
    }

    .component-crafting-item .requirement {
        display: inline-block;
    }

    .component-crafting-item .requirement:not(:first-child) {
        margin-left: 1em;
    }

    .component-crafting-item:not(:first-child) {
        border-top: 1px solid #ddd;
    }

    .component-crafting-item  .item-info {
        text-align: right;
    }
    .component-crafting-item .component-robot-container {
        clear: both;
    }
</style>

<script>
    import { craft, canCraft, item, stats } from '../../js/crafting';
    import { formatEnergy } from '../../js/utils';
    import RobotContainer from '../robot/container.vue';

    export default {

        components: {
            RobotContainer
        },

        props: [ 'item' ],

        computed: {
            showRobots() {
                return !!stats('robot');
            }
        },

        methods: {
            craft,
            canCraft,
            formatEnergy,

            icon(type) {
                return item(type).icon;
            }
        }

    }
</script>
