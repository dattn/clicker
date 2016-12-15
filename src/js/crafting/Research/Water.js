const Water = {
    type: 'water',
    label: 'Water',
    category: 'research',
    icon: 'icons/water.svg',
    limit: 1,
    requires: {
        energy: 1000,
        research: {
            sun: 1,
            wind: 1
        }
    }
};

export default Water;
