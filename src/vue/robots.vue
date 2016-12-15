<template>
    <div class="component-robots card" v-if="!isEmpty">
        <div class="card-header">
            Robots
            <button v-show="robotsOn" class="btn btn-sm btn-success float-xs-right" @click="turnRobotsOff">on</button>
            <button v-show="robotsOff" class="btn btn-sm btn-danger float-xs-right" @click="turnRobotsOn">off</button>
        </div>
        <robot-container class="card-block"></robot-container>
    </div>
</template>

<script>
    import { stats } from '../js/crafting';
    import RobotContainer from './robot/container.vue';

    export default {

        components: {
            RobotContainer
        },

        computed: {
            isEmpty() {
                return stats('robot') === 0;
            },

            robotsOn() {
                return this.$store.state.robotsOn;
            },

            robotsOff() {
                return !this.robotsOn;
            }
        },

        methods: {
            turnRobotsOff() {
                this.$store.commit('TURN_ROBOTS_OFF');
            },

            turnRobotsOn() {
                this.$store.commit('TURN_ROBOTS_ON');
            }
        }

    }
</script>
