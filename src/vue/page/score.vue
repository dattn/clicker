<template>
    <div>
        <h1>Score</h1>
        <table>
            <tr v-for="(item, index) in states">
                <td>{{ index }}</td>
                <td>{{ item.energy }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    import { joinStates, leaveStates, stateUpdate } from '../../js/server/client';

    export default {
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
        }
    }
</script>
