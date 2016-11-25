export default [
    {
        type: 'iron',
        label: 'Iron',
        category: 'resource',
        icon: 'src/icons/iron.svg',
        requires: {
            energy: 10
        }
    },
    {
        type: 'copper',
        label: 'Copper',
        category: 'resource',
        icon: 'src/icons/copper.svg',
        requires: {
            energy: 20
        }
    },
    {
        type: 'silicon',
        label: 'Silicon',
        category: 'resource',
        icon: 'src/icons/silicon.svg',
        requires: {
            energy: 25
        }
    },
    {
        type: 'battery',
        label: 'Battery',
        category: 'energy',
        icon: 'src/icons/battery.svg',
        requires: {
            energy: 40,
            resources: {
                iron: 2,
                copper: 4
            }
        }
    },
    {
        type: 'solar-panel',
        label: 'Solar Panel',
        category: 'energy',
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
