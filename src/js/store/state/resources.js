export default [
    {
        type: 'iron',
        label: 'Iron',
        requires: {
            energy: 10
        }
    },
    {
        type: 'copper',
        label: 'Copper',
        requires: {
            energy: 20
        }
    },
    {
        type: 'silicon',
        label: 'Silicon',
        requires: {
            energy: 25
        }
    },
    {
        type: 'solar-cell',
        label: 'Solar Cell',
        requires: {
            energy: 60,
            resources: {
                iron: 5,
                copper: 5,
                silicon: 5
            }
        }
    }
];
