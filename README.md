# Assumptions
- Assumed the monthly deposit is paid at the end of each month
- Assumed that interest rate is specified (as APR not APY) for the year
- Assumed that compounding happens every month

# Notes
- Added an artificial delay to each request to the server (to simulate real-world usage). Can be removed by commenting out [server/src/app.ts#L46](server/src/app.ts#L46)
- Added debounce delay to each request from the client (to rate-limit while user is still typing). Can be changed to `0` at [client/src/index.tsx#L12](client/src/index.tsx#L12)
- Run `yarn install` to install dependencies
- Run `yarn start` to start everything - if server starts later than client, initial request will fail. Will need a page reload in this case.
- Run `yarn test` to run all tests across client and server.

# Approaching the challenge
- First focus was to get a functional solution to the problem (just an MVP)
- All calculations are specified to be done on the server side so, I accounted for network delays - since client and server are running on the same machine, it's easy to overlook how users may use the client with different network conditions and the load it can cause to the server(s) if multiple users use the client concurrently. 
    - To this end, I added support for debouncing (essentially rate-limiting how frequently client sends requests to servers). This basically avoids sending a new request while the user is still typing a parameter. Set the debounce delay at 300ms - just above the average typing speed (250 cpm - 240 ms per character)
- Added tests to the client (not as extensive as I would like to see in a prod application but a few tests as poc)
- Refactored the server into its own folder
    - The key to good, readable, and maintainable code is also consistency. Server code at the top level kind of implied that it manages or has dependencies on the client. So, to make the components distant and decoupled, I moved server to its own folder.
    - As suggested, to think of an application that could evolve into something more complex, I refactored the server code into controllers, middleware, helpers etc. 
    - The above refactoring also helps with the Single Responsibility Principle (SRP).
        - `server.ts` just glues all the dependecies together. Not much business logic here. Any mistakes here should show up at build time (yaay for Typescript)
        - `app.ts` sets up all middleware in the appropriate order and inits each controller - can be easily tested with just a few test cases
        - `middleware` help route the requests like layers of an onion. I only added a couple - for input validation and error handling. But as the app evolves, there's scope for more such as output schema validation, authentication, rate-limiting etc. - each of these functions can be thought of orthogonal business requirements. With this architecture, we could implement all of them without breaking the SRP - yaay for maintainability, readability and also simpler tests :)
        - `helpers` are those which needs to instantiated and may be substituted with mocks during testing
        - `utils` are simple functions with basic control flow changes and generally pure functions
- I noticed that the commands between client, server and root project are all disjoined - they go by different name or do different thing depending on which module we issue a command. So, refactored / added commands that are consistent across modules
    - To install we have: `install` that runs `install-client` and `install-server`
    - To start we have: `start` that runs both `start-client` and `start-server`
    - To start with live reload we have: `watch` to run `watch-client` and `watch-server`
    - Similarly `test` runs `test-client` and `test-server`
    - And `watch-test` runs `watch-test-client` and `watch-test-server`
    - I removed the script to start the client since it seem to have the same effect as the start command after my changes - maybe I missed something here?
- Finally, added a few tests and some minor cleaup

# Changes I like

## On the whole
- Keeping with strong typing. I firmly believe that strong typing, when used correctly, can help catching a whole class of errors at build time and also improve dev productivity over the long run.
- Some tests in each component to setup a basic framework / reference for expanding coverage
- Having uniform commands across server and client (at least for basic tasks) so that knowledge is transferable between modules

## On the client side
- Grouping all inputs into a seperate component - this way, the component can be re-used in more screens potentially - such as having a table of projections or showing a pie-chart or other forms of outputs. The inputs group only cares about the input side of business logic - input validation, reporting valid changes, reporting input errors.
- Grouping chart with loader and error message into a seperate component - this way, we could use this for other scenarios where we get data from a remote service to show in a chart. It just handles showing a loader while the data is loading, showing a chart with loaded data, or showing an error message (only of them at given time).
- Debouncing - helps avoid flooding the server with needless requests while user is still typing
    - Extracting debounce logic into a helper class so that it can used in other places as well
- Placing api calls into a service 
    - Easier to test components that use this service by passing a mock - no web requests in testings
    - Easier to test the service itself because it does a limited number of things
- Generally, smaller components with each fullfilling a limited set of similar responsibilities - easier to read, test, and maintain.

## On server side
- As suggested earlier, moving to seperate folder that client and server are seen as clearly distinct modules.
- Adding controllers and middleware so that evolving bussiness requirements can be fulfilled without breaking the Single Responsibility Principle (SRP).
    - A complex server could easily evolve to require authenticated / unauthenticated requests, logging errors to a persistant db, logging requests, rate-limiting, caching etc. All of these can added as individual middleware without touching the core functionality of controllers. 
- Again, smaller components with each fullfilling a limited set of similar responsibilities - easier to read, test, and maintain.

# To improve
- No server side rate-limiting
- No extreme input checks such as integer overflows
- Negative numbers are prevented from the client input (but api will still accept them)
- Increased test coverage
    - No reference on how to write tests for graph components
- Less fragile tests on client side
    - In some of my tests, I get access to UI elements by looking up with their default values, this makes tests fragile across minor rewrites. Should use stronger invariants when looking up elements in a screen
- Consistent lint rules and styling across modules - client uses single quotes and lax on semi-colons, server lint strictly enforces double quotes and semi-colons
