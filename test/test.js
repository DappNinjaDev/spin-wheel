const {dappAddress, serverAccountAddress, serverAccountPublicKey, serverAccountSeed} = require('./config.js');
const {invokeScript, broadcast, waitForTx} = require('@waves/waves-transactions');
const wc = require('@waves/waves-crypto');
const crypto = wc.crypto();
const fetch = require('node-fetch');
const delay = require('delay');

// todo add testnet/mainnet mode

console.log('Dapp: ' + dappAddress);
console.log('Server address: ' + serverAccountAddress);

const signGame = (gameId, seed) => {
    const bytes = wc.base58Decode(gameId);
    return crypto.signBytes(seed, bytes);
};

const bet = async (dappAddress, expectedResult, amount, seed) => {
    const pubKey = crypto.publicKey(seed);

    const txData = invokeScript({
        dApp: dappAddress,
        call: {
            function: "bet",
            args: [
                {
                    type: "integer", value: expectedResult
                }
            ]
        },
        payment: [
            {amount: amount, asset: null}
        ],
        chainId: 'T',
        senderPublicKey: pubKey
    }, seed);

    return broadcast(txData, 'https://testnodes.wavesnodes.com')
        .then(tx => {
            console.log('Bet tx: ' + tx.id + '. Mining..');
            return tx;
        })
        .then(tx => waitForTx(tx.id, {apiBase: 'https://testnodes.wavesnodes.com'}))
        .then(result => {
            console.log('Bet is ready!');
            return result.id;
        })
        .catch(error => {
            console.log('Error bet: ' + error.message);
            //console.log(error);
        });
};

const result = (dappAddress, gameId, rsa, seed) => {
    const pubKey = crypto.publicKey(seed);

    const txData = invokeScript({
        dApp: dappAddress,
        call: {
            function: "result",
            args: [
                {
                    type: "string", value: gameId
                },
                {
                    type: "string", value: rsa
                },
            ]
        },
        payment: [],
        chainId: 'T',
        senderPublicKey: pubKey
    }, seed);

    return broadcast(txData, 'https://testnodes.wavesnodes.com')
        .then(tx => {
            console.log('Result tx: ' + tx.id + '. Mining..');
            return tx;
        })
        .then(tx => waitForTx(tx.id, {apiBase: 'https://testnodes.wavesnodes.com'}))
        .then(result => {
            console.log('Result is ready!');
            return result.id;
        })
        .catch(error => {
            console.log('Error result: ' + error.message);
            //console.log(error);
        });
};

(async () => {
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
