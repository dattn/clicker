<template>
    <div class="component-layout-earth">
        <tree :style="treeStyle"></tree>
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
            position: absolute;
            bottom: 72%;
            left: 58%;
        }
    }
</style>

<script>
    import Tree from './tree.vue';

    export default {
        components: {
            Tree
        },
        computed: {
            treeStyle() {
                const size = Math.max(1, Math.log(this.$store.state.treeSize));
                return {
                    width: size + '%',
                    marginLeft: -(size / 2) + '%'
                }
            }
        }
    }
</script>
