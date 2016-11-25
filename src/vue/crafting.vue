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
            <div class="card-block" v-for="item in itemsIn(category)">
                <span class="requirements">
                    <span v-if="item.requires.energy" class="requirement">
                        <img src="src/icons/energy.svg" class="icon" /> x {{ item.requires.energy }}
                    </span>
                    <span v-for="(amount, type) in item.requires.resources" class="requirement">
                        <img :src="getItem(type).icon" class="icon" /> x {{ amount }}
                    </span>
                </span>
                <h3 class="card-title">
                    {{ item.label }}
                </h3>
                <a href="#" class="btn btn-primary" @click="craft(item)">Craft</a>
            </div>
        </div>
    </div>
</template>

<style>
    .crafting .icon {
        height: 2em;
    }

    .crafting .requirements {
        float: right;
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
</style>

<script>
    import { mapActions } from 'vuex';
    import * as items from '../js/helpers/items';
    import * as text from '../js/helpers/text';

    export default {

        data() {
            return {
                category: 'resource',
                categories: [
                    'resource', 'energy'
                ]
            }
        },
        
        methods: {
            ...mapActions([
                'craft'
            ]),
            ...items,
            ...text,

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
