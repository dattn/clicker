<template>
    <div class="component-layout-counter">
        <tree></tree>
        <img src="layout/counter.svg" />
    </div>
</template>

<style lang="sass">
    .component-layout-counter {
        position: relative;
        img {
            top: 0px;
            width: 100%;
        }

        .component-layout-tree {
            position: absolute;
            width: 100%;
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
