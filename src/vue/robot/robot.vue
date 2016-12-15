<template>
    <div :class="classes">
        <img :src="icon" class="icon" />
    </div>
</template>

<style lang="sass">
    .component-robot-robot {
        display: inline-block;
        .icon {
            vertical-align: top;
            height: 2em;
            padding: 0 0.1em 0.1em 0;
        }

        &.off .icon {
            -webkit-filter: grayscale(100%);
            filter: grayscale(100%);
        }
    }
</style>

<script>
    import { item } from '../../js/crafting';

    const robot = item('robot');

    export default {
        computed: {
            icon() {
                return robot.icon;
            },

            classes() {
                return {
                    'component-robot-robot': true,
                    off: !this.$store.state.robotsOn
                }
            }
        }
    }
</script>
