<template>
    <div class="component-layout-wind">
        <img src="layout/wind.svg" />
        <div class="wind-force">
            {{windForce}}
        </div>
    </div>
</template>

<style lang="sass">
    @import "../../../node_modules/bootstrap/scss/variables.scss";
    @import "../../../node_modules/bootstrap/scss/mixins/_breakpoints.scss";

    .component-layout-wind {
        position: relative;
        img {
            width: 100%;
        }

        .wind-force {
            position: absolute;
            bottom: 0px;
            text-align: center;
            width: 60%;
            top: 60%;
            margin-top: -0.5em;
            font-size: 1.2vw;

            @include media-breakpoint-down(sm) {
                font-size: 1.2vw * 4;
            }
        }
    }
</style>

<script>
    export default {
        computed: {
            windForce() {
                return Math.round(this.$store.state.windForce);
            }
        }
    }
</script>
