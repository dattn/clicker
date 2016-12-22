import ManualGear     from './ManualGear';
import SolarUpgrade   from './SolarUpgrade';
import WindUpgrade    from './WindUpgrade';
import DamUpgrade     from './DamUpgrade';
import BatteryUpgrade from './BatteryUpgrade';

const indexedItems = {
    ManualGear, SolarUpgrade, WindUpgrade, DamUpgrade, BatteryUpgrade
};

const items = [
    ManualGear, SolarUpgrade, WindUpgrade, DamUpgrade, BatteryUpgrade
];

export default items;
export {
    items,
    indexedItems
};
