const {dappAddress, serverAccountAddress, serverAccountSeed} = require('./config.js');
//const {invokeScript, broadcast, nodeInteraction, waitForTx} = require('@waves/waves-transactions');
//const wc = require('@waves/waves-crypto');
const delay = require('delay');
//const fs = require('fs');
//const crypto = wc.crypto();
const daemonLib = require('./daemon-lib');


console.log('Dapp: ' + dappAddress);
console.log('Server address: ' + serverAccountAddress);


(async () => {
    while (true) {
        const done = await daemonLib.doJob();
        console.log('Iteration ' + done);
        if (!done) {
            await delay(1000);
        }
    }
})();
