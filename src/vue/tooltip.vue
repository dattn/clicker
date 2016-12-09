<template>
    <div :class="classes" role="tooltip">
        <div class="tooltip-inner">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="sass">
    .component-tooltip:not(.in) {
        z-index: -100;
    }
</style>

<script>
    import Tether from 'tether';

    export default {

        props: [ 'visible' ],

        mounted() {
            this.tether = new Tether({
                element: this.$el,
                target: this.$el.parentNode,
                attachment: 'top center',
                targetAttachment: 'bottom center'
            });
        },

        beforeDestroy() {
            this.tether.destroy();
        },

        computed: {
            classes() {
                return {
                    'component-tooltip': true,
                    tooltip: true,
                    'tooltip-bottom': true,
                    in: this.visible
                };
            }
        }
    }
</script>
