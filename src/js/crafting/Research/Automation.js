const Automation = {
    type: 'automation',
    label: 'Automation',
    category: 'research',
    icon: 'src/icons/automation.svg',
    limit: 1,
    requires: {
        energy: 1000,
        research: {
            sun: 1,
            wind: 1
        }
    }
};

export default Automation;
