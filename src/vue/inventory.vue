<template>
    <div class="card inventory" v-if="!inventoryIsEmpty">
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
    import { mapGetters } from 'vuex';
    import { item }       from '../js/crafting';

    export default {
        computed: {
            ...mapGetters([
                'inventoryIsEmpty'
            ]),

            inventory() {
                return this.$store.state.inventory;
            }
        },

        methods: {
            item
        }
    }
</script>
