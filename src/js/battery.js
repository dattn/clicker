const Battery = {

    capacity: 100,
    charged: 0,

    charge(energy) {
        energy = energy || 1;
        this.charged = Math.min(this.capacity, this.charged + energy);
    },

    disCharge(energy) {
        energy = energy || 1;

        if (this.charged - energy >= 0) {
            this.charged = this.charged - energy;
            return true;
        }

        return false;
    }

}

setInterval(() => Battery.disCharge(), 1000);

export default Battery;
