import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = []; // Dito ma sstore lahat ng item
    }

    addItem(count, unit, ingredient) { // Adding item sa array with unique ID
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // [2, 4, 8] splice(1, 1) -> returns 4, original array is [2,8]
        // [2, 4, 8] slice(1, 2) ->  original array is [4, 8]
        this.items.splice(index, 1); // I ddelete nya yung may kaparehas na ID sa loob ng array, na pinasa mo sa argument
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount; // This will going to find the first same ID in the array
    }
}