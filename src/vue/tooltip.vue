<template>
    <div :class="classes" role="tooltip">
        <div class="tooltip-inner">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import Tether from 'tether';

    export default {

        props: [ 'visible' ],

        mounted() {
            new Tether({
                element: this.$el,
                target: this.$el.parentNode,
                attachment: 'top center',
                targetAttachment: 'bottom center'
            });
        },

        computed: {
            classes() {
                return {
                    tooltip: true,
                    'tooltip-bottom': true,
                    in: this.visible
                };
            }
        }
    }
</script>
