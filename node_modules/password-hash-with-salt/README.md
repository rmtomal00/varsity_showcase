# password-hash-with-salt
NodeJS library for hash the passwords with salt

## Installation

```sh
npm i password-hash-with-salt
```

## Usage 

### Generate salt and hash from password

```javascript
const phws = require('password-hash-with-salt');

let password = '123456'; // password from user input
let result = await phws.generate(password);

console.log(result.salt); // store the salt to database
consle.log(result.hash); // store the hash as password in database
```

### Verify a password

```javascript
const phws = require('password-hash-with-salt');

let password = '123456'; // password from user input
let salt = 'read salt from database';
let hash = 'read hash from database';

let result = await phws.verify(password, hash, salt); // returns true or false
if (result) {
    // password is correct
} else {
    // password is incorrect
}
```

## Modes

The default mode is `fast`. You can change the mode by passing the mode as a last parameter to the `generate` and `verify` functions.

| Mode | Description |
| ---- | ----------- |
| secure | 10000 iterations |
| fast | 1000 iterations |
| fastest | 100 iterations |

## Tests    

```sh
npm test
```