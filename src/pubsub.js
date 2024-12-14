export const pubSub = {
    events: {},

    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = []; // Dynamically assign array for the event
        }

        this.events[event].push(callback); // Dynamically push to the correct event
    },

    publish(event, data) {
        if (this.events[event]) { // Check if there are subscribers for the event
            this.events[event].forEach((callback) => {
                callback(data); // Pass the data to each callback
            });
        }
    }
};