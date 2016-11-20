<template>
    <div>
        {{ formattedTime }}
    </div>
</template>

<script>
    import { time } from '../js/utils';
    import moment from 'moment';

    const data = {
        time: time()
    }

    setInterval(() => data.time = time(), 1000);

    export default {
        data() {
            return data;
        },

        computed: {
            formattedTime() {
                return moment('2016-01-01')
                    .startOf('day')
                    .seconds(this.time)
                    .format('HH:mm:ss');
            }
        }
    }
</script>
