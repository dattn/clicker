<template>
    <div class="component-robots card" v-if="!isEmpty">
        <div class="card-header">
            Robots
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


        }

    }
</script>
