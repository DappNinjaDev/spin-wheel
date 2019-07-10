// todo play 1000 games
// todo store random results by test start date
// todo show random stata
const {dappAddress, serverAccountAddress, serverAccountSeed} = require('./config.js');
const {bet, wait, getGameRandom} = require('./bet-lib.js');
const delay = require('delay');
const fs = require('fs');

// todo add testnet/mainnet mode

console.log('Dapp: ' + dappAddress);
console.log('Server address: ' + serverAccountAddress);

// todo add command for testing (amount of bets, is need send results or not and etc)
(async () => {
    for (let i = 0; i < 90; i++) {
        console.log('Do bet..', i);
        const betResult = await bet(dappAddress, 2, 100500000, serverAccountSeed);
        console.log('Wait tx..', betResult.id);
        await wait(betResult.id);
        console.log('Done!');
        fs.appendFileSync('random_stata.txt', betResult.id + "\r\n");
    }

    /*const array = fs.readFileSync('random_stata.txt').toString().split("\r\n");
    let log = {};
    console.log('Array length', array.length);
    for (let i = 0; i < array.length; i++) {
        const v = array[i];
        console.log(v);
        const result = await getGameRandom(v);
        if (result) {
            console.log(result.value);
            if (!log[result.value]) {
                log[result.value] = 1;
            } else {
                log[result.value]++;
            }
        } else {
            console.log('!!! Key not exists', result, v);
        }

        await delay(200);
    }
    console.log(log);*/

})();

