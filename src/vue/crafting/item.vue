<template>
    <div class="component-crafting-item card-block robot-container">
        <h3 class="card-title float-xs-left">
            <img :src="item.icon" class="icon" /> {{ item.label }}
        </h3>
        <div class="float-xs-right item-info">
            <p class="requirements">
                <span v-if="item.requires.energy" class="requirement">
                    <img src="src/icons/energy.svg" class="icon" /> x {{ item.requires.energy }}
                </span>
                <span v-for="(amount, type) in item.requires.resources" class="requirement">
                    <img :src="icon(type)" class="icon" /> x {{ amount }}
                </span>
            </p>
            <button class="btn btn-primary" @click="craft(item.type)" :disabled="!canCraft(item.type)">Craft</button>
        </div>
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
</style>

<script>
    import { craft, canCraft, item } from '../../js/crafting';

    export default {

        props: [ 'item' ],

        methods: {
            craft,
            canCraft,

            icon(type) {
                return item(type).icon;
            }
        }

    }
</script>
