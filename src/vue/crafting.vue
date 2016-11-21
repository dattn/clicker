<template>
    <div class="container-fluid">
        <div v-for="resource in resources" class="resource noselect row" @click="craft(resource)">
            <div class="col-sm-6">
                <h4>{{ resource.label }}</h4>
            </div>
            <div class="col-sm-6">
                <div v-if="resource.requires.energy">
                    <span class="category">Energy:</span> {{ resource.requires.energy }}
                </div>
                <div v-if="resource.requires.resources">
                    <span class="category">Resources:</span><br />
                    <ul>
                        <li v-for="(amount, index) in resource.requires.resources">{{ resourceLabel(index) }}: {{ amount }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .resource {
        border: 1px solid #999;
        padding: 10px;
        cursor: pointer;
        background-color: #CCC;
    }

    .resource:not(:last-child) {
        margin-bottom: 10px;
    }

    .resource .category {
        font-weight: bold;
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
            resourceLabel: function(type) {
                var [ resource ] = this.resources.filter(r => r.type === type);
                return resource? resource.label : type;
            }
        }

    }
</script>
