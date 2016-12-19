<template>
    <div class="component-page-score">
        <router-link :to="{ name: 'clicker' }" tag="button" class="btn btn-primary">back</router-link>
        <div class="earth-container">
            <earth :style="earthStyle"></earth>
        </div>
        <table>
            <tr v-for="(item, index) in states">
                <td>{{ index }}</td>
                <td>{{ item.energy }}</td>
            </tr>
        </table>
    </div>
</template>

<style lang="sass">
    @import "../../../node_modules/bootstrap/scss/bootstrap.scss";

    html, body {
        height: 100%;
    }

    .component-page-score {
        min-height: 100%;
        background-color: #000000;

        .earth-container {
            position: absolute;
            top: 0px;
            left: 0px;
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>

<script>
    import { joinStates, leaveStates, stateUpdate } from '../../js/server/client';
    import Earth from '../layout/earth.vue';

    export default {
        components: {
            Earth
        },

        data() {
            return {
                states: {}
            }
        },

        created() {
            joinStates();

            this.stateUpdate = stateUpdate(data => {
                this.states = {
                    ...this.states,
                    [data.publicUUID]: data.state
                };
            });
        },

        beforeDestroy() {
            this.stateUpdate.off();
            leaveStates();
        },

        computed: {
            earthStyle() {
                return {
                    width: '50%'
                }
            }
        }
    }
</script>
