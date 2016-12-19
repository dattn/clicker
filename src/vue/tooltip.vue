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

    .component-tooltip .tooltip-inner {
        max-width: none;
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

        updated() {
            if (this.visible) {
                this.tether.position();
            }
        },

        beforeDestroy() {
            var tooltipElement = this.tether.element;
            this.tether.destroy();
            tooltipElement.parentNode.removeChild(tooltipElement);
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
