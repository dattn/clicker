export default [
    {
        type: 'iron',
        label: 'Iron',
        icon: 'src/icons/iron.svg',
        requires: {
            energy: 10
        }
    },
    {
        type: 'copper',
        label: 'Copper',
        icon: 'src/icons/copper.svg',
        requires: {
            energy: 20
        }
    },
    {
        type: 'silicon',
        label: 'Silicon',
        icon: 'src/icons/silicon.svg',
        requires: {
            energy: 25
        }
    },
    {
        type: 'solar-panel',
        label: 'Solar Panel',
        icon: 'src/icons/solar-panel.svg',
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
