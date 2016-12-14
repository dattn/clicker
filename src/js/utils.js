const realDurationInMs = 24 * 60 * 60 * 1000;

export const gameTime = (durationInMinutes) => {
    const gameDurationInMs = durationInMinutes * 60 * 1000;
    const currentTimeInMs = ((Date.now() % gameDurationInMs) / gameDurationInMs) * realDurationInMs;
    return Math.round(currentTimeInMs / (1000 * 60));
}

export const windForce = () => {
    const now = Date.now();
    const maxForce = 100;
    const x = now / 20000;
    const y = ((((Math.sin(x) + Math.sin(x / 5.2) + Math.sin((x + 0.2) / 2.1) ) / 3) + 1) / 2);
    return Math.round(y * maxForce * 100) / 100;
}

export const dayLight = (time) => {
    const currentHour = time / 60;

    if ( currentHour < 7 || currentHour >= 21) {
        return 0;
    }

    if ( currentHour >= 7 && currentHour < 9) {
        return (currentHour - 7) / 2;
    }

    if ( currentHour >= 19 && currentHour < 21) {
        return 1 - ((currentHour - 19) / 2);
    }

    return 1;
}

// http://stackoverflow.com/a/2450976/907375
export const shuffle = (arr) => {
    var currentIndex = arr.length, temporaryValue, randomIndex;
    var arr = [...arr]; // copy array

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }

    return arr;
}
