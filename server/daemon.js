const {dappAddress, serverAccountAddress} = require('./config.js');
const delay = require('delay');
const daemonLib = require('./daemon-lib');
console.log('Dapp: ' + dappAddress);
console.log('Server address: ' + serverAccountAddress);

(async () => {
    while (true) {
        let done = false;
        try {
            done = await daemonLib.doJob();
            console.log('Iteration ' + done);
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }

        if (!done) {
            await delay(1000);
        }
    }
})();
