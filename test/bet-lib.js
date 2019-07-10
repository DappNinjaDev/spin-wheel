const {dappAddress, seed, serverAccountAddress, serverAccountPublicKey, serverAccountSeed} = require('./config.js');
const {invokeScript, broadcast, waitForTx, transfer, nodeInteraction} = require('@waves/waves-transactions');
const wc = require('@waves/waves-crypto');
const crypto = wc.crypto();
const fetch = require('node-fetch');
const delay = require('delay');

const config = {
    prod: {},
    dev: {
        url: 'https://testnodes.wavesnodes.com'
    }
};

const getConfig = (key) => {
    return config['dev'][key];
};

// todo add testnet/mainnet mode

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

    return broadcast(txData, getConfig('url'));
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

const withdraw = (dappAddress, sumWaves, toAddress, seed) => {
    //const pubKey = crypto.publicKey(seed);
    const txData = transfer({
        amount: sumWaves * 100000000,
        recipient: toAddress,
        fee: 500000
    }, seed);

    return broadcast(txData, 'https://testnodes.wavesnodes.com');
};

const withdrawHack = (dappAddress, sumWaves, toAddress, seed) => {
    //const pubKey = crypto.publicKey(seed);
    const txData = transfer({
        amount: sumWaves * 100000000,
        recipient: toAddress,
        fee: 500000,
        senderPublicKey: 'Bhyvkx4xdbEi4KPJNZSzx9gZgzgyLEsavuj2kYSt7SST',
        sender: '3N8M61KCm8G72mK8PjacFbnnxdbFsyqQDeT'
    }, seed);

    return broadcast(txData, 'https://testnodes.wavesnodes.com');
};

const wait = (id) => {
    return waitForTx(id, {apiBase: getConfig('url')})
};

const getGameRandom = (id) => {
    return nodeInteraction.accountDataByKey(`${id}_RESULT`, dappAddress, getConfig('url'));
};


module.exports = {signGame, bet, result, withdraw, wait, getGameRandom};
