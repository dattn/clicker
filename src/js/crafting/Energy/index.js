import Battery     from './Battery';
import HydroDam    from './HydroDam';
import SolarPanel  from './SolarPanel';
import WindMill    from './WindMill';
import Lightbulb   from './Lightbulb';
import BioGasPlant from './BioGasPlant';
import MoonPanel   from './MoonPanel';

const indexedItems = {
    Battery, HydroDam, SolarPanel, WindMill, Lightbulb, BioGasPlant, MoonPanel
};

const items = [
    Battery, HydroDam, SolarPanel, WindMill, Lightbulb, BioGasPlant, MoonPanel
];

export default items;
export {
    items,
    indexedItems
};
