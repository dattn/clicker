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
                const resource = this.$store.state.resources.find(function(resource) {
                    return resource.type === type;
                });
                if (!resource) {
                    return null;
                }
                return resource.icon;
            },

            label(type) {
                const resource = this.$store.state.resources.find(function(resource) {
                    return resource.type === type;
                });
                if (!resource) {
                    return null;
                }
                return resource.label;
            }
        }
    }
</script>
