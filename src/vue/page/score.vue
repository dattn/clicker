<template>
    <div class="component-page-score container-fluid">
        <div class="row">
            <div class="col-lg-4 stats-container">
                <div>
                    <input type="text" class="form-control" v-once :value="name" @input="updateName" placeholder="Your Name" maxlength="50" />
                    <table class="table table-inverse table-sm">
                        <thead>
                            <tr>
                                <th colspan="2">Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Clicks</th>
                                <td class="text-xs-right">{{ stats.clicks }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Energy produced</th>
                                <td class="text-xs-right">{{ stats.energy }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-inverse table-sm">
                        <thead>
                            <tr>
                                <th colspan="2">Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(count, item) in stats.items">
                                <th scope="row">{{ item }}</th>
                                <td class="text-xs-right">{{ count }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-inverse table-sm">
                        <thead>
                            <tr>
                                <th colspan="2">Player</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in statesOrderedByTreeSize">
                                <th class="player-name">{{ item.name }}</th>
                                <td class="text-xs-right">{{ formatTreeSize(item.treeSize) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-lg-8 earth-container">
                <earth :style="earthStyle" @click.native="goToClicker"></earth>
            </div>
        </div>
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

            &> div {
                position: relative;
                min-width: 60%;
                max-width: 100%;

                table {
                    width: 100%;
                }
            }

            .player-name {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: 12em;
            }
        }
    }
</style>

<script>
    import { joinStates, leaveStates, stateUpdate } from '../../js/server/client';
    import { formatTreeSize } from '../../js/utils';
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
                    width: '80%'
                }
            },
            stats() {
                return this.$store.state.stats;
            },
            name() {
                return this.$store.state.name;
            },
            statesOrderedByTreeSize() {
                const states = Object.values(this.states);
                return states.sort((a, b) => {
                    return b.treeSize - a.treeSize;
                });
            }
        },

        methods: {
            goToClicker() {
                this.$router.push({
                    name: 'clicker'
                });
            },

            updateName(ev) {
                this.$store.commit('UPDATE_NAME', {
                    name: ev.target.value
                });
            },

            formatTreeSize
        }
    }
</script>
