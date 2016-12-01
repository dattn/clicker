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

export default items;
export {
    items,
    indexedItems
};

export const item = function(type) {
    const index = fromSnakeCase(type);
    if (!indexedItems[index]) {
        throw 'Item "' + type + '" not found';
    }
    return indexedItems[index];
}

export const fromCategory = function(category) {
    return items.filter(item => item.category === category);
}
