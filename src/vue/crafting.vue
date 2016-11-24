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
            <div class="card-block" v-for="resource in inCategory(resources, category)">
                <span class="requirements">
                    <span v-if="resource.requires.energy" class="requirement">
                        <img src="src/icons/energy.svg" class="icon" /> x {{ resource.requires.energy }}
                    </span>
                    <span v-for="(amount, type) in resource.requires.resources" class="requirement">
                        <img :src="icon(type)" class="icon" /> x {{ amount }}
                    </span>
                </span>
                <h3 class="card-title">
                    {{ resource.label }}
                </h3>
                <a href="#" class="btn btn-primary" @click="craft(resource)">Craft</a>
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

    export default {

        data() {
            return {
                category: 'resource',
                categories: [
                    'resource', 'energy'
                ]
            }
        },

        computed: {
            resources() {
                return this.$store.state.resources;
            }
        },

        methods: {
            ...mapActions([
                'craft'
            ]),

            icon: function(type) {
                return this.$store.state.resources.find(function(resource) {
                    return resource.type === type;
                }).icon;
            },

            navClasses: function(category) {
                return {
                    'nav-link': true,
                    active: category === this.category
                }
            },

            switchCategory: function(category) {
                this.category = category;
            },

            inCategory(resources, category) {
                return resources.filter(item => item.category === category);
            },

            capitalize(value) {
                return value[0].toUpperCase() + value.slice(1);
            }
        },

    }
</script>
