const hydroDam = {
    type: 'hydro-dam',
    label: 'Hydroelectric Dam',
    category: 'energy',
    icon: 'src/icons/hydro-dam.svg',
    requires: {
        energy: 500,
        resources: {
            iron: 50,
            copper: 10
        }
    }
};

export default hydroDam;
