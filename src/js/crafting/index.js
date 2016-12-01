import * as Energy   from './Energy';
import * as Resource from './Resource';

const fromSnakeCase = function(text) {
    var camelCase = text.replace(/(\-\w)/g, m => m[1].toUpperCase());
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

const indexedItems = {
    ...Energy.indexedItems,
    ...Resource.indexedItems
};

const items = [
    ...Energy.items,
    ...Resource.items
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

const canCraft = function(state, type) {
    const requires = item(type).requires;

    if (requires.energy && requires.energy > state.energy.energy) {
        return false;
    }

    if (requires.resources) {
        for (let type in requires.resources) {
            if (!state.inventory[type] || requires.resources[type] > state.inventory[type]) {
                return false;
            }
        }
    }

    return true;
}

export default items;
export {
    items,
    indexedItems,
    item,
    fromCategory,
    canCraft
};
