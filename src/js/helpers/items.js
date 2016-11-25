export const getItem = function(type) {
    return this.$store.state.craftingItems.find(item => item.type === type);
}

export const itemsIn = function(category) {
    return this.$store.state.craftingItems.filter(item => item.category === category);
}
