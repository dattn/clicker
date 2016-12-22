<template>
    <div class="component-crafting card crafting">
        <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs float-xs-left">
                <li class="nav-item" v-for="category in categories">
                    <a :class="navClasses(category)" href="#" @click="switchCategory(category)">{{ capitalize(category) }}</a>
                </li>
            </ul>
        </div>
        <div>
            <crafting-item v-for="item in items" :item="item"></crafting-item>
        </div>
    </div>
</template>

<style>
    .crafting .icon {
        height: 2em;
    }

    .crafting .requirement {
        display: inline-block;
    }

    .crafting .requirement:not(:first-child) {
        margin-left: 1em;
    }

    .crafting .card-block:not(:first-child) {
        border-top: 1px solid #ddd;
    }

    .crafting  .item-info {
        text-align: right;
    }
</style>

<script>
    import { capitalize } from '../js/utils';
    import { fromCategory, isAvailable, isCraftable } from '../js/crafting';
    import CraftingItem from './crafting/item.vue';

    export default {

        data() {
            return {
                category: 'resource',
                categories: [
                    'resource', 'energy', 'upgrade', 'research', 'automation'
                ]
            }
        },

        components: {
            CraftingItem
        },

        computed: {
            items() {
                return fromCategory(this.category).filter(item => {
                    if (!isCraftable(item.type) || !isAvailable(item.type)) {
                        return false;
                    }
                    if (item.limit && item.limit <= (this.$store.state.items[item.type] || 0)) {
                        return false;
                    }
                    return true;
                });
            }
        },

        methods: {
            capitalize,

            navClasses(category) {
                return {
                    'nav-link': true,
                    active: category === this.category
                }
            },

            switchCategory: function(category) {
                this.category = category;
            },

        },

    }
</script>
