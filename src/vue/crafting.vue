<template>
    <div class="container-fluid">
        <div class="card card-block craft-box" v-for="resource in resources">
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
</template>

<style>
    .craft-box .icon {
        height: 2em;
    }

    .craft-box .requirements {
        float: right;
    }

    .craft-box .requirement {
        display: inline-block;
    }

    .craft-box .requirement:not(:first-child) {
        margin-left: 1em;
    }
</style>

<script>
    import { mapActions } from 'vuex';

    export default {

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
            }
        }

    }
</script>
