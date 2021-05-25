# Readme

This is my entry for the JumpCloud backend sw engineer application. I will note that of the listed languages, I would only consider myself "fluent" in JavaScript. Additionally, my experience with Node.js is somewhat limited. I am happy to discuss this aspect of my application in the review stage and a little embarrased it didn't come up in the previous interview.

As the assignment only stated "NodeJS", I took the liberty of using TypeScript as I see it as a force-multiplier when it comes to development in JS.

## Setup and Execution

To start, pull down the repo and run `npm install` in a terminal.

To run the tests, run the command `npm run test`. This will compile and run the tests for you.

If you wish to build it for packaging and use, run the command `npm run build` and it will compile the TypeScript into JavaScript in the `dist` directory.

## Design Commentary

At first I went with a very simple module, but converted it to a class in order to manage state for testing. I'm sure there has to be some DI utilities that are idiomatic to Node. If not, it's not difficult to put in an adapter module that instantiates a single `ActionTracker` instance and exposes it.

I also made a note that the assignment uses the Go convention of returning an error (or tuple including an error). I wanted to point out that this was not idiomatic, but was expressed in requirements. An inline comment was also left to clarify this.

The output of the stats is not 1:1 with the example output. However, it is both semantically equivalent and about equally readable. If the single object per line was a true requirement, it should have been stated more explicitly. I would have asked a product (or a liaison from another team if this was an integration) if that specific string format was ok, or just any equivalent JSON string. If it was necessary to match the output, I would have created another private method (or possibly an entirely separate module) that would print the object in the desired format. I thought that would be overkill on complexity for this assignment.

I did keep the concurrency considerations when designing this module. The biggest concern is the shared state of the actions list.

I decided to import lodash for the 2 utility functions, as it is fairly well known, and I would rather not re-invent the wheel (the assignment did say to treat it like it would be going into production). Imports in JS these days are pretty tight (both aesthetically and in terms of excess code). If I were writing this in C#, those would have been LINQ methods built into the base library, so I considered them fair game.