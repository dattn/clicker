<template>
    <div class="card inventory">
        <div class="card-header">
            Inventory
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="(count, type) in inventory">
                <span class="tag tag-default tag-pill float-xs-right">{{ count }}</span>
                <img v-if="icon(type)" :src="icon(type)" class="icon" />
                <span v-if="label(type)">{{ label(type) }}</span>
                <span v-else>Unknown</span>
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
    export default {
        computed: {
            inventory() {
                return this.$store.state.inventory;
            }
        },

        methods: {
            icon(type) {
                const item = this.$store.state.craftingItems.find(function(item) {
                    return item.type === type;
                });
                if (!item) {
                    return null;
                }
                return item.icon;
            },

            label(type) {
                const item = this.$store.state.craftingItems.find(function(item) {
                    return item.type === type;
                });
                if (!item) {
                    return null;
                }
                return item.label;
            }
        }
    }
</script>
