<template>
    <div class="component-page-score container-fluid">
        <div class="row">
            <div class="col-lg-4 stats-container">
                <div>
                    <p>
                        <button class="btn btn-secondary" @click="goToClicker">Back To Clicker</button>
                    </p>
                    <table class="table table-inverse">
                        <tr>
                            <th>Clicks</th>
                            <td>{{ clicks }}</td>
                        </tr>
                        <tr>
                            <th>Energy produced</th>
                            <td>{{ energy }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="col-lg-8 earth-container">
                <earth :style="earthStyle"></earth>
            </div>
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
    $enable-flex: true;

    @import "../../../node_modules/bootstrap/scss/bootstrap.scss";

    html, body {
        height: 100%;
    }

    .component-page-score {
        height: 100%;
        background-color: #000000;

        &> .row {
            height: 100%;
        }

        .earth-container {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .stats-container {
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
            },
            clicks() {
                return this.$store.state.stats.clicks;
            },
            energy() {
                return this.$store.state.stats.energy;
            }
        },

        methods: {
            goToClicker() {
                this.$router.push({
                    name: 'clicker'
                });
            }
        }
    }
</script>
