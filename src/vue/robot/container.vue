<template>
    <div :class="classes">
        <div class="placeholder" v-if="showPlaceholder">Drop robot here</div>
        <robot v-for="n in robots"></robot>
    </div>
</template>

<style lang="sass">
    @import "../../../node_modules/dragula/dist/dragula";

    .component-robot-container {
        line-height: 2em;
        font-size: 2em;
        position: relative;

        .placeholder {
            position: absolute;
            z-index: 0;
            top: 0px;
            text-align: center;
            font-size: 0.8em;
            width: 100%;
        }
    }

    .component-robot-container.dragging {
        min-height: 2em;
    }
</style>

<script>
    import Robot from './robot.vue';
    import dragula from 'dragula';
    import { has } from '../../js/crafting';

    const elIsRobot = el => {
        return el.classList.contains('component-robot-robot');
    };

    const drake = dragula({
        moves: el => elIsRobot(el)
    });

    export default {

        props: [ 'type' ],

        components: {
             Robot
        },

        data() {
            return {
                dragging: false
            }
        },

        mounted() {
            drake.containers.push(this.$el);
            drake.on('drop', (el, target, source) => {
                if (this.type && source !== target) {
                    source.appendChild(el);
                    if (target === this.$el) {
                        this.$store.commit('ADD_ROBOT', {
                            type: this.type
                        });
                    }
                    if (source === this.$el) {
                        this.$store.commit('REMOVE_ROBOT', {
                            type: this.type
                        });
                    }
                }
            });
            drake.on('drag', () => this.dragging = true);
            drake.on('dragend', () => this.dragging = false);

        },

        beforeDestroy() {
            const index = drake.containers.indexOf(this.$el);
            if (index > -1) {
                drake.containers.splice(index, 1);
            }
        },

        computed: {
            robots() {
                if (!this.type) {
                    var robots = has('robot');
                    for (let type in this.$store.state.robots) {
                        robots -= this.$store.state.robots[type];
                    }
                    return robots;
                }
                return this.$store.state.robots[this.type] || 0;
            },

            showPlaceholder() {
                return this.dragging && this.robots === 0;
            },

            classes() {
                return {
                    'component-robot-container': true,
                    dragging: this.dragging
                }
            }
        }

    }
</script>
