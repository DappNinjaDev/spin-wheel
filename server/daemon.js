const {dappAddress, serverAccountAddress, serverAccountPublicKey, serverAccountSeed} = require('./config.js');
const {invokeScript, broadcast} = require('@waves/waves-transactions');
const wc = require('@waves/waves-crypto');
const crypto = wc.crypto();


console.log('Dapp: ' + dappAddress);
console.log('Server address: ' + serverAccountAddress);

const signGame = (gameId, seed) => {
    const bytes = crypto.stringToBytes(gameId);
    const gameIdBase58 = wc.base58Encode(bytes);
    const signBase58 = wc.crypto().signBytes(seed, bytes, Uint8Array.from([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]));

    return {
        gameIdBase58,
        signBase58
    };
};

const sendSignedGame = (dappAddress, gameIdBase58, signBase58, seed) => {
    const pubKey = crypto.publicKey(seed);

    const txData = invokeScript({
        dappAddress: dappAddress,
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

};

const data = signGame('111111', serverAccountSeed);
//console.log(data.gameIdBase58, data.signBase58);
sendSignedGame(dappAddress, data.gameIdBase58, data.signBase58, serverAccountSeed);
//exports.ADDRESS_OR_ALIAS = val => exports.BASE58_STRING('3N8M61KCm8G72mK8PjacFbnnxdbFsyqQDeT');
