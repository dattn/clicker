<template>
    <div class="component-layout-earth">
        <tree></tree>
        <img src="layout/earth.svg" />
    </div>
</template>

<style lang="sass">
    .component-layout-earth {
        position: relative;

        img {
            width: 100%;
        }

        .component-layout-tree {
            width: 2%;
            position: absolute;
            bottom: 72%;
            margin-left: -1%;
            left: 58%;
        }
    }
</style>

<script>
    import Tree from './tree.vue';

    export default {
        components: {
            Tree
        }
    }
</script>
