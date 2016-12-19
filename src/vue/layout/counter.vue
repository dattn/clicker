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
            width: 100%;
        }

        .component-layout-tree {
            position: absolute;
            margin-left: 15%;
            width: 70%;
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
