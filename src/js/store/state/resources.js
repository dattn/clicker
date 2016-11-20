export default [
    {
        type: 'wood',
        label: 'Wood',
        requires: [
            { type: 'energy', amount: 10 }
        ]
    },
    {
        type: 'stone',
        label: 'Stone',
        requires: [
            { type: 'energy', amount: 20 }
        ]
    },
    {
        type: 'iron',
        label: 'Iron',
        requires: [
            { type: 'energy', amount: 30 }
        ]
    }
];
