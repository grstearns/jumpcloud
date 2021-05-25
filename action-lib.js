// `actions` is a map of arrays.
//  The key is the action name and the contents of
//  the array are all of the times for that action.
const actions = new Map();

export function addAction(action) {
    try {
        // Parse the action string...
        const parsed = JSON.parse(action);
        const actionName = parsed.action;
        const time = parsed.time;

        // New array for new key
        if (!actions.has(actionName)) {
            actions.set(actionName, [time]);
        } else {
            const times = actions.get(actionName);
            times.push(time);
        }

        // No error, no return value (see below)
        return null;
    } catch (error) {
        // Requirement is for us to _return_ an error instead of throwing (Go style)
        return new Error("action must be a JSON string with keys \"action\" (string) and \"time\" (number)");
    }
}

export function getStats() {
    // We could just construct a string as we go,
    //  but this is much more flexible (at some perf cost)
    const statsArray = [];

    // Sadly you cannot .map() a Map, so we have to loop it
    actions.forEach((action, times) => {
        const actionStat = {action: action};
        
        actionStat.avg = average(times);

        statsArray.push(actionStat);
    });

    return JSON.stringify(statsArray, null, 4);
}

// This should be an array of numbers
function average(array) {
    // This fold is built around an accumulator object with the current sum and count
    const {sum, count} = times.reduce((prevAcc, currVal) => (
        {
            sum: prevAcc.sum + currVal, 
            count: prevAcc.count + 1
        }),
        // initialize the accumulator
        {sum: 0, count: 0});

    return sum / count;
}