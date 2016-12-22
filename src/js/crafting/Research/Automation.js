const Automation = {
    type: 'automation',
    label: 'Automation',
    category: 'research',
    icon: 'icons/automation.svg',
    limit: 1,
    requires: {
        energy: 2500,
        research: {
            sun: 1,
            wind: 1
        }
    }
};

export default Automation;
