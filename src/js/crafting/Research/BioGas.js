const BioGas = {
    type: 'bio-gas',
    label: 'Biogas',
    category: 'research',
    icon: 'icons/biogas.svg',
    limit: 1,
    requires: {
        energy: 5000,
        research: {
            chemistry: 1
        }
    }
};

export default BioGas;
