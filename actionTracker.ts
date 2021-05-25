export class ActionTracker {
    // The `actions` map ties an action name to all the instance times
    private actions:Map<string, [number]> = new Map();

    addAction = (action:string) => {
        try {
            // Parse the action string...
            const parsed = JSON.parse(action);
            const actionName = parsed.action;
            const time = parsed.time;

            // New array for new key
            if (!this.actions.has(actionName)) {
                // Under _extreme_ concurrent load, this might not be atomic
                this.actions.set(actionName, [time]);
            } else {
                const times = this.actions.get(actionName);
                times?.push(time);
            }

            // No error, no return value (see below)
            return null;
        } catch (error) {
            // Requirement is for us to _return_ an error instead of throwing (Go style)
            return new Error("action must be a JSON string with keys \"action\" (string) and \"time\" (number)");
        }
    }

    getStats = () => {
        // We could just construct a string as we go,
        //  but this is much more flexible (at some perf cost)
        const statsArray:[{action:string, avg:number}?] = [];

        // Sadly you cannot .map() a Map, so we have to loop it
        //  Map.forEach returns the value then the key
        this.actions.forEach((times, action) => {
            const avg = this.average(times);
            const actionStat = {action: action, avg: avg};        

            statsArray.push(actionStat);
        });

        return JSON.stringify(statsArray, null, 4);
    }

    // This should be an array of numbers
    private average = (array: [number]) => {
        
        // This fold is built around an accumulator object with the current sum and count
        const {sum, count} = array.reduce((prevAcc, currVal) => (
            {
                sum: prevAcc.sum + currVal, 
                count: prevAcc.count + 1
            }),
            // initialize the accumulator
            {sum: 0, count: 0});

        return sum / count;
    }
};