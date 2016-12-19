import Battery    from './Battery';
import HydroDam   from './HydroDam';
import SolarPanel from './SolarPanel';
import WindMill   from './WindMill';
import Lightbulb  from './Lightbulb';

const indexedItems = {
    Battery, HydroDam, SolarPanel, WindMill, Lightbulb
};

const items = [
    Battery, HydroDam, SolarPanel, WindMill, Lightbulb
];

export default items;
export {
    items,
    indexedItems
};
