<template>
    <div class="component-layout-counter">
        <tree></tree>
        <button v-show="lightsOn" class="btn btn-sm btn-success float-xs-right" @click.stop="turnLightsOff">on</button>
        <button v-show="lightsOff" class="btn btn-sm btn-danger float-xs-right" @click.stop="turnLightsOn">off</button>
        <img src="layout/counter.svg" />
    </div>
</template>

<style lang="sass">
    .component-layout-counter {
        position: relative;
        img {
            top: 0px;
            width: 100%;
        }

        .component-layout-tree {
            position: absolute;
            width: 100%;
        }

        button {
            position: absolute;
            bottom: 1.5%;
            width: 70%;
            left: 15%;
        }
    }
</style>

<script>
    import Tree from './tree.vue';

    export default {
        components: {
            Tree
        },

        computed: {
            lightsOn() {
                return this.$store.state.lightsOn;
            },

            lightsOff() {
                return !this.lightsOn;
            }
        },

        methods: {
            turnLightsOff() {
                this.$store.commit('TURN_LIGHTS_OFF');
            },

            turnLightsOn() {
                this.$store.commit('TURN_LIGHTS_ON');
            }
        }
    }
</script>
