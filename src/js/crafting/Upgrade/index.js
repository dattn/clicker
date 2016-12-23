import ManualGear     from './ManualGear';
import SolarUpgrade   from './SolarUpgrade';
import WindUpgrade    from './WindUpgrade';
import DamUpgrade     from './DamUpgrade';
import BatteryUpgrade from './BatteryUpgrade';
import MiningUpgrade  from './MiningUpgrade';
import MoonUpgrade    from './MoonUpgrade';

const indexedItems = {
    ManualGear, SolarUpgrade, WindUpgrade, DamUpgrade, BatteryUpgrade, MiningUpgrade, MoonUpgrade
};

const items = [
    ManualGear, SolarUpgrade, WindUpgrade, DamUpgrade, BatteryUpgrade, MiningUpgrade, MoonUpgrade
];

export default items;
export {
    items,
    indexedItems
};
