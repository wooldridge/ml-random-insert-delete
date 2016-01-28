# ml-random-insert-delete

Node.js script that uses the MarkLogic Node.js Client API to randomly insert and delete 
documents from a MarkLogic database over time.

From the root directory, install dependencies:

`npm install`

Then run script:

`node index <integer>`

Where `<integer>` is the number of seconds to run script (e.g., `600` to run for 10 minutes).

MarkLogic settings may be edited here: `config.js`
