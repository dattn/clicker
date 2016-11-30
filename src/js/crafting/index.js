import Energy   from './Energy';
import Resource from './Resource';

const items = [
    ...Energy,
    ...Resource
];

export default items;

export const byType = function(type) {
    return items.find(item => item.type === type);
}

export const byCategory = function(category) {
    return items.filter(item => item.category === category);
}
