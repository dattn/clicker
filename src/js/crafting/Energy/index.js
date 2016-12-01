import Battery    from './Battery';
import HydroDam   from './HydroDam';
import SolarPanel from './SolarPanel';
import WindMill   from './WindMill';

const indexedItems = {
    Battery, HydroDam, SolarPanel, WindMill
};

const items = [
    Battery, HydroDam, SolarPanel, WindMill
];

export default items;
export {
    items,
    indexedItems
};
