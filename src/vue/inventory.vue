<template>
    <div class="component-inventory card inventory">
        <div class="card-header">
            Inventory
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="(count, type) in inventory">
                <span class="tag tag-default tag-pill float-xs-right">{{ count }}</span>
                <img :src="item(type).icon" class="icon" />
                <span>{{ item(type).label }}</span>
            </li>
        </ul>
    </div>
</template>

<style>
    .inventory .icon {
        height: 2em;
    }

    .inventory .tag {
        font-size: 1.3em;
    }

    .inventory .list-group-item:first-child {
        border-top: 0px;
    }
    .inventory .list-group-item:last-child {
        border-bottom: 0px;
    }
</style>

<script>
    import { item, fromCategory } from '../js/crafting';
    import { formatNumber } from '../js/utils';

    export default {
        computed: {
            inventory() {
                const items = fromCategory('resource');
                var inventory = {};
                for (let i = 0; i < items.length; i++) {
                    if (this.$store.state.items[items[i].type]) {
                        inventory[items[i].type] = formatNumber(this.$store.state.items[items[i].type]);
                    }
                }
                return inventory;
            }
        },

        methods: {
            item
        }
    }
</script>
