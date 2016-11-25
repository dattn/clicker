export const getItem = function(type) {
    return this.$store.state.craftingItems.find(item => item.type === type);
}

export const itemsIn = function(category) {
    return this.$store.state.craftingItems.filter(item => item.category === category);
}

export const canCraft = function(requirements) {
    if (requirements.energy && requirements.energy > this.$store.getters.energy) {
        return false;
    }

    if (requirements.resources) {
        for (var type in requirements.resources) {
            if (!this.$store.state.inventory[type] || requirements.resources[type] > this.$store.state.inventory[type]) {
                return false;
            }
        }
    }

    return true;
}
