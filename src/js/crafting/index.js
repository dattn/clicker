import * as Energy     from './Energy';
import * as Resource   from './Resource';
import * as Research   from './Research';
import * as Automation from './Automation';
import { store } from '../app';

const fromSnakeCase = function(text) {
    var camelCase = text.replace(/(\-\w)/g, m => m[1].toUpperCase());
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

const indexedItems = {
    ...Energy.indexedItems,
    ...Resource.indexedItems,
    ...Research.indexedItems,
    ...Automation.indexedItems
};

const items = [
    ...Energy.items,
    ...Resource.items,
    ...Research.items,
    ...Automation.items
];

const item = function(type) {
    const index = fromSnakeCase(type);
    if (!indexedItems[index]) {
        throw 'Item "' + type + '" not found';
    }
    return indexedItems[index];
}

const fromCategory = function(category) {
    return items.filter(item => item.category === category);
}

const canCraft = function(type) {
    if (!isAvailable(type)) {
        return false;
    }

    const requires = item(type).requires;

    if (requires.energy && requires.energy > store.state.energy) {
        return false;
    }

    if (requires.resources) {
        for (let type in requires.resources) {
            if (!store.state.items[type] || requires.resources[type] > store.state.items[type]) {
                return false;
            }
        }
    }

    return true;
}

const isAvailable = function(type) {
    const requires = item(type).requires;

    if (requires.research) {
        for (let type in requires.research) {
            if (!store.state.items[type] || requires.research[type] > store.state.items[type]) {
                return false;
            }
        }
    }

    return true;
}

const craft = function(type) {
    if (!canCraft(type)) {
        return false;
    }
    const requires = item(type).requires;

    if (requires.energy) {
        store.commit('BATTERY_DISCHARGE', {
            amount: requires.energy
        });
    }

    if (requires.resources) {
        for (let type in requires.resources) {
            store.commit('ITEM_REMOVE', {
                type,
                amount: requires.resources[type]
            });
        }
    }

    store.commit('ITEM_ADD', {
        type,
        amount: 1
    });
}

const has = function(type) {
    return store.state.items[type] || 0;
}

const stats = function(type) {
    return store.state.stats.items[type] || 0;
}

export default items;
export {
    items,
    indexedItems,
    item,
    fromCategory,
    isAvailable,
    canCraft,
    craft,
    has,
    stats
};
