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
            <div class="card-block" v-for="item in byCategory(category)">
                <h3 class="card-title float-xs-left">
                    <img :src="item.icon" class="icon" /> {{ item.label }}
                </h3>
                <div class="float-xs-right item-info">
                    <p class="requirements">
                        <span v-if="item.requires.energy" class="requirement">
                            <img src="src/icons/energy.svg" class="icon" /> x {{ item.requires.energy }}
                        </span>
                        <span v-for="(amount, type) in item.requires.resources" class="requirement">
                            <img :src="getItem(type).icon" class="icon" /> x {{ amount }}
                        </span>
                    </p>
                    <button class="btn btn-primary" @click="craft(item)" :disabled="!canCraft(item.requires)">Craft</button>
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
    import { mapActions } from 'vuex';
    import * as items from '../js/helpers/items';
    import * as text from '../js/helpers/text';
    import { byCategory } from '../js/crafting';

    export default {

        data() {
            return {
                category: 'resource',
                categories: [
                    'resource', 'energy', 'upgrade', 'research'
                ]
            }
        },

        methods: {
            ...mapActions([
                'craft'
            ]),
            ...items,
            ...text,
            byCategory,

            navClasses: function(category) {
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
