export const inventoryIsEmpty = (state) => {
    return Object.keys(state.inventory).length === 0;
}
