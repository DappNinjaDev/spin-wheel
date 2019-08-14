const {dappAddress, serverAccountAddress} = require('./config.js');
const delay = require('delay');
const daemonLib = require('./daemon-lib');
const envs = ['testnet', 'mainnet'];
const env = process.argv.slice(2)[0];

if (!envs.includes(env)) {
    console.log('Define env: ' + envs.join(', '));
    return;
}

console.log('Env: ' + env);
console.log('Dapp: ' + dappAddress);
console.log('Server address: ' + serverAccountAddress);

(async () => {
    daemonLib.init(env);
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
