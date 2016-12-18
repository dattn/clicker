<template>
    <div class="component-layout-watch">
        <sun :style="sunStyle"></sun>
        <moon :style="moonStyle"></moon>
        <div class="time">
            <span class="content">
                {{ formattedTime }}
            </span>
        </div>
    </div>
</template>

<style lang="sass">
    @import "../../../node_modules/bootstrap/scss/variables.scss";
    @import "../../../node_modules/bootstrap/scss/mixins/_breakpoints.scss";

    .component-layout-watch {
        position: relative;

        .component-layout-sun,
        .component-layout-moon {
            width: 100%;
            transition: opacity 1s linear;
        }

        .component-layout-moon {
            top: 0px;
            position: absolute;
        }

        .time {
            position: absolute;
            top: 0px;
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            .content {
                flex: none;
                font-size: 1.2vw;

                @include media-breakpoint-down(md) {
                    font-size: 1.2vw * 4;
                }
            }
        }
    }
</style>

<script>
    import Sun from './sun.vue';
    import Moon from './moon.vue';
    import moment from 'moment';
    import { dayLight } from '../../js/utils';

    export default {
        components: {
            Sun,
            Moon
        },

        computed: {
            formattedTime() {
                return moment('2016-01-01')
                    .startOf('day')
                    .minutes(this.$store.state.time)
                    .format('HH:mm');
            },

            sunStyle() {
                return {
                    opacity: dayLight(this.$store.state.time)
                }
            },

            moonStyle() {
                return {
                    opacity: 1 - dayLight(this.$store.state.time)
                }
            }
        }
    }
</script>
