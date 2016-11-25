<template>
    <ul class="list-group energy-items">
        <li class="list-group-item" v-for="(count, type) in items">
            <div class="icon-container">
                <div class="icon-wrapper" v-for="n in count">
                    <img :src="getItem(type).icon" class="icon" />
                </div>
            </div>
        </li>
    </ul>
</template>

<style>
    .energy-items .icon-container {
        padding: 0 0.5em 0.5em 0;
        line-height: 0.5ex;
        font-size: 3em;
    }

    .energy-items .icon-wrapper {
        display: inline-block;
        height: 0.5em;
        width: 0.5em;
        overflow: visible;
    }

    .energy-items .icon-wrapper .icon {
        height: 1em;
    }
</style>

<script>
    import { getItem } from '../js/helpers/items';

    export default {
        computed: {
            items() {
                return this.$store.state.energy.items;
            }
        },

        methods: {
            getItem
        }
    }
</script>
