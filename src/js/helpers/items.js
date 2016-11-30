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
