<template>
    <div>
        <div v-for="resource in resources" class="resource noselect" @click="craft(resource)">
            {{ resource.label }} ( <span v-for="require in resource.requires">{{ require.type }}: {{ require.amount }}</span> )
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
            ])
        }

    }
</script>
