<template>
    <div class="component-page-score container-fluid">
        <slider class="component-slider" v-model="bulbColor" @change-color="onChangeBulbColor" v-show="showSlider"></slider>
        <div class="row">
            <div class="col-lg-4 stats-container">
                <div>
                    <div class="card card-inverse" style="background-color: #333; border-color: #333;">
                        <div class="card-block">
                            <h3 class="card-title">Your Name</h3>
                            <p class="card-text">
                                <input type="text" class="form-control" v-once :value="name" @input="updateName" placeholder="Your Name" maxlength="50" />
                            </p>
                        </div>
                    </div>
                    <table class="table table-inverse table-bordered table-sm">
                        <thead>
                            <tr>
                                <th :colspan="showCompareScore? 3 : 2">
                                    <span>Stats</span>
                                    <select class="form-control" v-model="selectedPlayer">
                                        <option v-for="player in players" :value="player.uuid">{{player.name}}</option>
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="showCompareScore">
                                <th></th>
                                <th class="text-xs-right">You</th>
                                <th class="text-xs-right">Player</th>
                            </tr>
                            <tr>
                                <td>Tree Height</td>
                                <td class="text-xs-right" v-if="showCompareScore">{{ formatTreeSize(myState.treeSize) }}</td>
                                <td class="text-xs-right">{{ formatTreeSize(playerState.treeSize) }}</td>
                            </tr>
                            <tr>
                                <td>Energy produced</td>
                                <td class="text-xs-right" v-if="showCompareScore">{{ formatEnergy(myState.stats.energy) }}</td>
                                <td class="text-xs-right">{{ formatEnergy(playerState.stats.energy) }}</td>
                            </tr>
                            <tr>
                                <td>Mouse Clicks</td>
                                <td class="text-xs-right" v-if="showCompareScore">{{ formatEnergy(myState.stats.clicks) }}</td>
                                <td class="text-xs-right">{{ formatEnergy(playerState.stats.clicks) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-inverse table-bordered table-sm">
                        <thead>
                            <tr>
                                <th colspan="2">
                                    <span>Highscore</span>
                                    <select class="form-control" v-model="highscoreType">
                                        <option v-for="type in highscoreTypes" :value="type.key">{{type.label}}</option>
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in highscoreList">
                                <td class="player-name">{{ item.name }}</td>
                                <td class="text-xs-right">{{ item.score }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-lg-8 earth-container" ref="earth-container">
                <earth ref="earth" @click.native="goToClicker" :state="playerState"  @bulbClickedEvent="bulbClicked(arguments[0])"></earth>
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

            thead th {
                font-size: 1.5em;
            }

            th, td {
                padding: 0.3em 0.6em;
            }

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

        .component-slider {
            z-index: 1;
            position: fixed;
            top: 50%;
            left: 50%;
        }
    }
</style>

<script>
    import { joinStates, leaveStates, stateUpdate } from '../../js/server/client';
    import { formatTreeSize, formatEnergy, formatNumber } from '../../js/utils';
    import Earth from '../layout/earth.vue';
    import { Slider } from 'vue-color';

    export default {
        components: {
            Earth,
            Slider,
        },

        data() {
            return {
                currentBulbIndex: 0,
                bulbColor: {hex: this.$store.state.lightBulbColors[0]},
                states: {},
                highscoreType: 'treeSize',
                highscoreTypes: [
                    {
                        key: 'treeSize',
                        label: 'Tree Height'
                    },
                    {
                        key: 'mouseClicks',
                        label: 'Mouse Clicks'
                    },
                    {
                        key: 'energyProduced',
                        label: 'Energy Produced'
                    }
                ],
                selectedPlayer: 'me',
                showSlider: false
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
            playerState() {
                if (this.selectedPlayer === 'me') {
                    return this.$store.state;
                }
                return this.states[this.selectedPlayer];
            },
            myState() {
                return this.$store.state;
            },
            showCompareScore() {
                return this.selectedPlayer !== 'me';
            },
            stats() {
                return this.playerState.stats;
            },
            name() {
                return this.$store.state.name;
            },
            players() {
                var players = [];
                for (let uuid in this.states) {
                    players.push({
                        uuid,
                        name: this.states[uuid].name
                    });
                }
                return [
                    {
                        uuid: 'me',
                        name: this.$store.state.name
                    },
                    ...players
                        .sort((a, b) => {
                            return a.name - b.name;
                        })
                ];
            },
            highscoreList() {
                const states = [
                    ...Object.values(this.states),
                    this.$store.state
                ];
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
            formatTreeSize,

            goToClicker() {
                if (this.showSlider) {
                    this.showSlider = false;
                } else {
                    this.$router.push({
                        name: 'clicker'
                    });
                }
            },

            onChangeBulbColor (val) {
                if (this.selectedPlayer === 'me') {
                   this.$store.commit('UPDATE_BULB_COLOR', { color: val.hex, bulbIndex: this.currentBulbIndex });
                   this.bulbColor = {hex: this.$store.state.lightBulbColors[this.currentBulbIndex]};
                }
            },

            updateName(ev) {
                this.$store.commit('UPDATE_NAME', {
                    name: ev.target.value
                });
            },

            bulbClicked(index) {
                if (this.selectedPlayer === 'me') {
                    this.showSlider = true;
                    this.currentBulbIndex = index;
                    this.bulbColor = {hex: this.$store.state.lightBulbColors[this.currentBulbIndex]};
                }
            },
        }
    }
</script>
