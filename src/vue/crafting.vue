<template>
    <div class="card crafting">
        <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs float-xs-left">
                <li class="nav-item" v-for="category in categories">
                    <a :class="navClasses(category)" href="#" @click="switchCategory(category)">{{ capitalize(category) }}</a>
                </li>
            </ul>
        </div>
        <div>
            <div class="card-block" v-for="item in items">
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
    import * as text        from '../js/helpers/text';
    import { fromCategory, craft, canCraft, isAvailable, item } from '../js/crafting';

    export default {

        data() {
            return {
                category: 'resource',
                categories: [
                    'resource', 'energy', 'upgrade', 'research'
                ]
            }
        },

        computed: {
            items() {
                return fromCategory(this.category).filter(item => {
                    if (!isAvailable(item.type)) {
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
            ...text,
            craft,
            canCraft,

            icon(type) {
                return item(type).icon;
            },

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
