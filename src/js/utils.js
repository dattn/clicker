// 24 hours => 55 minutes
const gameMs = 55 * 60 * 1000;
const realMs = 24 * 60 * 60 * 1000;

export const time = () => {
    const currentMs = ((Date.now() % gameMs) / gameMs) * realMs;
    return Math.round(currentMs / 1000);
}
