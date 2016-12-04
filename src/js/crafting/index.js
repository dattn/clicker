import * as Energy   from './Energy';
import * as Resource from './Resource';
import * as Research from './Research';

const fromSnakeCase = function(text) {
    var camelCase = text.replace(/(\-\w)/g, m => m[1].toUpperCase());
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

const indexedItems = {
    ...Energy.indexedItems,
    ...Resource.indexedItems,
    ...Research.indexedItems
};

const items = [
    ...Energy.items,
    ...Resource.items,
    ...Research.items
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

const canCraft = function(store, type) {
    if (!isAvailable(store, type)) {
        return false;
    }

    const requires = item(type).requires;

    if (requires.energy && requires.energy > store.state.energy.energy) {
        return false;
    }

    if (requires.resources) {
        for (let type in requires.resources) {
            if (!store.state.inventory[type] || requires.resources[type] > store.state.inventory[type]) {
                return false;
            }
        }
    }

    return true;
}

const isAvailable = function(store, type) {
    const requires = item(type).requires;

    if (requires.research) {
        for (let type in requires.research) {
            if (!store.state.research[type] || requires.research[type] > store.state.research[type]) {
                return false;
            }
        }
    }

    return true;
}

const craft = function(store, type) {
    if (!canCraft(store, type)) {
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
            store.commit('INVENTORY_REMOVE', {
                type,
                amount: requires.resources[type]
            });
        }
    }

    switch(item(type).category) {

        case 'resource':
            store.commit('INVENTORY_ADD', {
                type: type,
                amount: 1
            });
            break;

        case 'energy':
            store.commit('ENERGY_ADD', {
                type: type,
                amount: 1
            });
            break;

        case 'research':
            store.commit('RESEARCH_ADD', {
                type: type,
                amount: 1
            });
            break;
    }

}

export default items;
export {
    items,
    indexedItems,
    item,
    fromCategory,
    isAvailable,
    canCraft,
    craft
};
