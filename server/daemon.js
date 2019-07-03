const {dappAddress, serverAccountAddress, serverAccountPublicKey, serverAccountSeed} = require('./config.js');
const {invokeScript, broadcast} = require('@waves/waves-transactions');
const wc = require('@waves/waves-crypto');
const crypto = wc.crypto();

console.log('Dapp: ' + dappAddress);
console.log('Server address: ' + serverAccountAddress);

const signGame = (gameId, seed) => {
    const bytes = wc.base58Decode(gameId);
    return crypto.signBytes(seed, bytes);
};

/*const sendSignedGame = (dappAddress, gameIdBase58, signBase58, seed) => {
    const pubKey = crypto.publicKey(seed);

    const txData = invokeScript({
        dApp: dappAddress,
        call: {
            function: "GenerateRandInt",
            args: [
                {
                    type: "string", value: gameIdBase58
                },
                {
                    type: "string", value: signBase58
                },
            ]
        },
        payment: [],
        chainId: 'T',
        senderPublicKey: pubKey
    }, seed);

    broadcast(txData, 'https://testnodes.wavesnodes.com')
        .then(resp => {
            console.log(resp);
        })
        .catch(error => {
            console.log('Error: ' + error.message);
            //console.log(error);
        });

};*/
const bet = (dappAddress, expectedResult, amount, seed) => {
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

    broadcast(txData, 'https://testnodes.wavesnodes.com')
        .then(resp => {
            console.log(resp);
        })
        .catch(error => {
            console.log('Error: ' + error.message);
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

    broadcast(txData, 'https://testnodes.wavesnodes.com')
        .then(resp => {
            console.log(resp);
        })
        .catch(error => {
            console.log('Error: ' + error.message);
            //console.log(error);
        });

};

const gameId = '21hVN9jMTvtS5Hmft9YoL1ch8uKgNKvwL8WeSpFAmqNi';
const sign = signGame(gameId, serverAccountSeed);
console.log('Sign is', sign);
/*sendSignedGame(dappAddress, data.gameIdBase58, data.signBase58, serverAccountSeed);*/
//const r=crypto.base58Decode(crypto.sha256(data.signBase58));
//console.log(Number(r));
//bet(dappAddress, 2, 100500000, serverAccountSeed);
result(dappAddress, gameId, sign, serverAccountSeed);
