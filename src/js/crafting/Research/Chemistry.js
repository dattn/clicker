const Chemistry = {
    type: 'chemistry',
    label: 'Chemistry',
    category: 'research',
    icon: 'icons/chemistry.svg',
    limit: 1,
    requires: {
        energy: 5000,
        research: {
            sun: 1,
            wind: 1,
            water: 1
        }
    }
};

export default Chemistry;
