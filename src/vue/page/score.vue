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
                                <th scope="row">Mouse Clicks</th>
                                <td class="text-xs-right">{{ formatNumber(stats.clicks) }}</td>
                            </tr>
                            <tr>
                                <th scope="row">Energy produced</th>
                                <td class="text-xs-right">{{ formatEnergy(stats.energy) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-inverse table-sm">
                        <thead>
                            <tr>
                                <th colspan="2">
                                    <span>Highscore</span>
                                    <select class="form-control" v-model="highscoreType">
                                        <option v-for="type in highscoreTypes" :value="type.key">{{type.label}}</option>
                                    </select>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in highscoreList">
                                <th class="player-name">{{ item.name }}</th>
                                <td class="text-xs-right">{{ item.score }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-lg-8 earth-container" ref="earth-container">
                <earth ref="earth" @click.native="goToClicker"></earth>
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
            overflow: hidden;
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
    import { formatTreeSize, formatEnergy, formatNumber } from '../../js/utils';
    import Earth from '../layout/earth.vue';

    export default {
        components: {
            Earth
        },

        data() {
            return {
                states: {},
                highscoreType: 'treeSize',
                highscoreTypes: [
                    {
                        key: 'treeSize',
                        label: 'Tree Size'
                    },
                    {
                        key: 'mouseClicks',
                        label: 'Mouse Clicks'
                    },
                    {
                        key: 'energyProduced',
                        label: 'Energy Produced'
                    }
                ]
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
            stats() {
                return this.$store.state.stats;
            },
            name() {
                return this.$store.state.name;
            },
            highscoreList() {
                const states = Object.values(this.states);
                return states
                    .sort((a, b) => {
                        if (this.highscoreType === 'treeSize') {
                            return (b.treeSize || 0) - (a.treeSize || 0);
                        }
                        if (this.highscoreType === 'mouseClicks') {
                            return (b.stats.clicks || 0) - (a.stats.clicks || 0);
                        }
                        if (this.highscoreType === 'energyProduced') {
                            return (b.stats.energy || 0) - (a.stats.energy || 0);
                        }
                    })
                    .slice(0, 10)
                    .map((state) => {
                        let player = {
                            name: state.name
                        };
                        if (this.highscoreType === 'treeSize') {
                            player.score = formatTreeSize(state.treeSize);
                        }
                        if (this.highscoreType === 'mouseClicks') {
                            player.score = formatNumber(state.stats.clicks);
                        }
                        if (this.highscoreType === 'energyProduced') {
                            player.score = formatEnergy(state.stats.energy);
                        }
                        return player;
                    });
            }
        },

        updated() {
            const earthHeight = this.$refs['earth'].$el.offsetHeight;
            const earthContainerHeight = this.$refs['earth-container'].clientHeight - 30;
            const earthWidth = this.$refs['earth'].$el.offsetWidth;
            const earthContainerWidth = this.$refs['earth-container'].clientWidth - 30;
            const zoom = Math.min(earthContainerHeight / earthHeight, earthContainerWidth / earthWidth);
            this.$refs['earth'].$el.style.transform = 'scale(' + zoom + ')';
        },

        methods: {
            formatNumber,
            formatEnergy,

            goToClicker() {
                this.$router.push({
                    name: 'clicker'
                });
            },

            updateName(ev) {
                this.$store.commit('UPDATE_NAME', {
                    name: ev.target.value
                });
            }
        }
    }
</script>
