<template>
    <span>
        {{ formattedTime }}
    </span>
</template>

<script>
    import moment from 'moment';

    export default {
        computed: {
            formattedTime() {
                return moment('2016-01-01')
                    .startOf('day')
                    .minutes(this.$store.state.time)
                    .format('HH:mm');
            }
        }
    }
</script>
