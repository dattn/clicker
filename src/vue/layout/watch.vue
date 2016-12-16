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
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -webkit-align-items: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -webkit-justify-content: center;
            -ms-flex-pack: center;
            justify-content: center;

            .content {
                -webkit-box-flex: 0;
                -webkit-flex: none;
                -ms-flex: none;
                flex: none;
                font-size: 1.8vw;

                @include media-breakpoint-down(sm) {
                    font-size: 1.8vw * 4;
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
