<template>
    <div class="component-robots card" v-if="!isEmpty">
        <div class="card-header">
            Robots
        </div>
        <div class="card-block robot-container">
            <img :src="icon" class="icon" v-for="n in robots" />
        </div>
    </div>
</template>

<style lang="sass">
    @import "../../node_modules/dragula/dist/dragula";

    .component-robots {

        .robot-container {
            line-height: 2em;
            font-size: 2em;

            .icon {
                vertical-align: top;
                height: 2em;
                padding: 0 0.1em 0.1em 0;
            }
        }

    }
</style>

<script>
    import { has, item } from '../js/crafting';
    import dragula from 'dragula';

    const robot = item('robot');

    export default {

        mounted() {
            dragula([...document.querySelectorAll('.robot-container')]);
        },

        computed: {
            isEmpty() {
                return this.robots === 0;
            },

            robots() {
                return has('robot');
            },

            icon() {
                return robot.icon;
            }
        }

    }
</script>
