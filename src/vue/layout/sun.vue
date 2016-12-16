<template>
    <div class="component-layout-sun">
        <img src="layout/sun.svg" />
    </div>
</template>

<style lang="sass">
    @-webkit-keyframes rotate {
        from {
            -webkit-transform: rotate(0deg);
        }
        to {
            -webkit-transform: rotate(360deg);
        }
    }

    @-moz-keyframes rotate {
        from {
            -moz-transform: rotate(0deg);
        }
        to {
            -moz-transform: rotate(360deg);
        }
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .component-layout-sun {
        position: relative;
        img {
            width: 100%;
            -webkit-animation-name: rotate;
            -webkit-animation-duration: 50s;
            -webkit-animation-iteration-count: infinite;
            -webkit-animation-timing-function: linear;
            -moz-animation-name: rotate;
            -moz-animation-duration: 50s;
            -moz-animation-iteration-count: infinite;
            -moz-animation-timing-function: linear;
            animation-name: rotate;
            animation-duration: 50s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
    }
</style>
