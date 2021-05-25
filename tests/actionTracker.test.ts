import {ActionTracker} from '../actionTracker';
import {expect} from 'chai';

describe('addAction', () => {
    it('returns error if no input', () => {
        const actions = new ActionTracker();
        const result = actions.addAction("");
        expect(result?.message).to.contain("action");
    });

    it('returns error if string is not json', () => {
        const actions = new ActionTracker();
        const result = actions.addAction("abc, 123");
        expect(result?.message).to.contain("action");
    });

    it('returns error for improper format', () => {
        const actions = new ActionTracker();
        const result = actions.addAction('{"action":123, "time":"abc"}');
        expect(result?.message).to.contain("action");
    });

    it('returns null for proper json', () => {
        const actions = new ActionTracker();
        const result = actions.addAction('{"action":"test", "time":123}');
        expect(result).to.not.be.ok;
    });
});

describe('getStats', () => {  
    it('returns an empty list string given no actions', () => {
        const actions = new ActionTracker();
        const result = actions.getStats();
        expect(result).to.equal("[]");
    });

    it('returns an object given an action', () => {
        const actions = new ActionTracker();
        actions.addAction('{"action":"test", "time":123}');
        const result = actions.getStats();

        const expected = [{ action: "test", avg: 123 }];
        const parsedResult = JSON.parse(result);
        
        // NOTE: `eql` is "deep equality", it tests by key/value matches instead of reference
        expect(parsedResult).to.eql(expected);
    });

    it('has an avg equal to the average of inputs', () => {
        const actions = new ActionTracker();
        actions.addAction('{"action":"test", "time":  0}');
        actions.addAction('{"action":"test", "time": 10}');
        const result = actions.getStats();

        const expected = [{ action: "test", avg: 5 }];
        const parsedResult = JSON.parse(result);
        
        expect(parsedResult).to.eql(expected);
    });

    it('groups stats by action name', () => {
        const actions = new ActionTracker();
        actions.addAction('{"action":"jump", "time":100}');
        actions.addAction('{"action":"run", "time":75}');

        actions.addAction('{"action":"jump", "time":200}');
        const result = actions.getStats();

        const expected = [
            {"action":"jump", "avg":150},
            {"action":"run", "avg":75}
        ];
        const parsedResult = JSON.parse(result);
        
        expect(parsedResult).to.eql(expected);
    });
});
