const SpaceMining = {
    type: 'space-mining',
    label: 'Space Mining',
    category: 'research',
    icon: 'icons/rocket-ship.svg',
    limit: 1,
    requires: {
        energy: 50000,
        research: {
            chemistry: 1
        }
    }
};

export default SpaceMining;
