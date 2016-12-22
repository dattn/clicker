import Battery     from './Battery';
import HydroDam    from './HydroDam';
import SolarPanel  from './SolarPanel';
import WindMill    from './WindMill';
import Lightbulb   from './Lightbulb';
import BioGasPlant from './BioGasPlant';

const indexedItems = {
    Battery, HydroDam, SolarPanel, WindMill, Lightbulb, BioGasPlant
};

const items = [
    Battery, HydroDam, SolarPanel, WindMill, Lightbulb, BioGasPlant
];

export default items;
export {
    items,
    indexedItems
};
