const {dappAddress, serverAccountAddress, serverAccountSeed} = require('./config.js');
const {bet} = require('./bet-lib.js');

// todo add testnet/mainnet mode

console.log('Dapp: ' + dappAddress);
console.log('Server address: ' + serverAccountAddress);

// todo add command for testing (amount of bets, is need send results or not and etc)
(async () => {
    //withdraw(dappAddress, 0.9, '3MuJmCSEUgBNy1R2gesk59xDbWcuTKwwixW', seed).then(console.log)
    //withdrawHack(dappAddress, 0.9, '3MuJmCSEUgBNy1R2gesk59xDbWcuTKwwixW', serverAccountSeed).then(console.log)
    const betResult = await bet(dappAddress, 2, 100500000, serverAccountSeed);
    /*const sign = signGame(betResult, serverAccountSeed);
    console.log('Sign is', sign);
    await result(dappAddress, betResult, sign, serverAccountSeed);
    for (let i = 0; i <= 100; i++) {
        const response = await fetch(`https://testnodes.wavesnodes.com/addresses/data/${dappAddress}/${betResult}_STATUS`);
        const json = await response.json();
        console.log(json);
        if (json.value && json.value !== "NEW") {
            console.log(json.value);
            return;
        } else {
            await delay(1000);
        }
    }*/
})();
