import ManualGear     from './ManualGear';
import SolarUpgrade   from './SolarUpgrade';
import WindUpgrade    from './WindUpgrade';
import DamUpgrade     from './DamUpgrade';
import BatteryUpgrade from './BatteryUpgrade';
import MiningUpgrade  from './MiningUpgrade';

const indexedItems = {
    ManualGear, SolarUpgrade, WindUpgrade, DamUpgrade, BatteryUpgrade, MiningUpgrade
};

const items = [
    ManualGear, SolarUpgrade, WindUpgrade, DamUpgrade, BatteryUpgrade, MiningUpgrade
];

export default items;
export {
    items,
    indexedItems
};
