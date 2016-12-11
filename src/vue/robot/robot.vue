<template>
    <div class="component-robot-robot">
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
    }
</style>

<script>
    import { item } from '../../js/crafting';

    const robot = item('robot');

    export default {
        computed: {
            icon() {
                return robot.icon;
            }
        }
    }
</script>
