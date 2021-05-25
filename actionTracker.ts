import groupBy from 'lodash/groupBy';
import mean from 'lodash/mean';
import toPairs from 'lodash/toPairs';

export class ActionTracker {
    // The most concurrency-friendly way is just to keep track of all the entries
    private actions:[{action:string, time:number}?] = [];

    addAction = (action:string) => {
        try {
            // Parse the action string...
            const parsed = JSON.parse(action);
            const actionName = parsed.action;
            const time = parsed.time;

            // Check the types
            if (typeof(actionName) !== 'string') throw new Error;
            if (typeof(time) !== 'number') throw new Error;

            // make sure we only store the stuff we want
            this.actions.push({action: actionName, time: time});

            // No error, no return value (see below)
            return null;
        } catch (error) {
            // Requirement is for us to _return_ an error instead of throwing (Go style)
            return new Error("action must be a JSON string with keys \"action\" (string) and \"time\" (number)");
        }
    }

    getStats = () => {
        // Let's  break-down what's happening here:
        //  1. We take our list of actions and collect them into a dictionary by their action name
        const groups = groupBy(this.actions, 'action'); // e.g. { jump: [{action:'jump', time:10}], run: [{action:'run' ... }] }

        //  2. Since we can't map() over an object, we use toPairs to turn them into duples (or "2-tuples")
        const duples = toPairs(groups); // e.g. [ ['jump', [{action:'jump', ...}] ], ['run', [...]], ]]

        //  3. We can map of that array of duples since they're already collected the way we want them
        const statsArray = duples.map(([actionName, actions]) => ({
            //  4. The last step is to extract and aggregate the times for each grouping
            action: actionName,
            avg: mean(actions.map(x => x.time)),
        }));

        // We're doing this so that our interactions with the shared state of `this.actions` is as atomic as possible
        //  so that we're able to handle high levels of concurrency.

        return JSON.stringify(statsArray, null, 4);
    }
};