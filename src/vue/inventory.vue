<template>
    <table class="table table-sm">
        <tr v-for="(count, type) in inventory">
            <td>
                <img v-if="icon(type)" :src="icon(type)" class="icon" />
                <span v-if="label(type)">{{ label(type) }}</span>
                <span v-else>Unknown</span>
            </td>
            <td>{{ count }}</td>
        </tr>
    </table>
</template>

<style>
    .icon {
        height: 2em;
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
