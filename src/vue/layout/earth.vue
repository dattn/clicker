<template>
    <div class="component-layout-earth">
        <tree ref="tree" :style="treeStyle"></tree>
        <img ref="earth" class="earth-image" src="layout/earth.svg" />
    </div>
</template>

<style lang="sass">
    .component-layout-earth {
        position: relative;

        img {
            width: 100%;
        }

        .component-layout-tree {
            position: relative;
            left: 58%;
            margin-bottom: -28%;
        }
    }
</style>

<script>
    import Tree from './tree.vue';

    const updateSizes = (comp) => {
        comp.$el.style.marginTop = Math.max(0, comp.$refs.earth.offsetHeight - comp.$el.offsetHeight) + 'px';
        const overflowWidth = comp.$refs.tree.$el.offsetWidth - comp.$el.offsetWidth;
        if (overflowWidth > 0) {
            comp.$el.style.paddingLeft = ((overflowWidth / 2) * 0.42) + 'px';
            comp.$el.style.paddingRight = ((overflowWidth / 2) * 0.58) + 'px';
        } else {
            comp.$el.style.paddingLeft = '0px';
            comp.$el.style.paddingRight = '0px';
        }
    }

    export default {
        components: {
            Tree
        },
        mounted() {
            updateSizes(this);
        },
        updated() {
            updateSizes(this);
        },
        computed: {
            treeStyle() {
                const size = Math.max(1, Math.sqrt(this.$store.state.treeSize * 10));
                return {
                    width: size + '%',
                    marginLeft: -(size / 2) + '%'
                }
            }
        }
    }
</script>
