const {dappAddress, serverAccountAddress, serverAccountPublicKey, serverAccountSeed} = require('./config.js');
const {invokeScript, broadcast} = require('@waves/waves-transactions');
const wc = require('@waves/waves-crypto');
const crypto = wc.crypto();

console.log('Dapp: ' + dappAddress);
console.log('Server address: ' + serverAccountAddress);

const signGame = (gameId, seed) => {
    const bytes = wc.base58Decode(gameId);
    //const bytes = crypto.stringToBytes(gameId);
    const gameIdBase58 = wc.base58Encode(bytes);
    //const rand = Uint8Array.from("1".repeat(64).split('').map(Number));
    //const signBase58 = wc.crypto().signBytes(seed, bytes, rand);
    const signBase58 = crypto.signBytes(seed, bytes);
    /*const isCorrect = crypto.verifySignature('DrYgfD7j6AKD1iXtn9uhMka95ATZB42B1kGKCUATP2UG', bytes, signBase58);
    console.log('Game id 58', gameIdBase58);
    console.log('Is correct', isCorrect);*/


    return {
        gameIdBase58,
        signBase58
    };
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
const bet = (dappAddress, expectedResult, seed) => {
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
            {amount: 1110000, asset: null}
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

const gameId = '6ksrfB7Hr5w8i1jKD32fbnYV17Jp7QoAvoTBd8ZQYNkj';
const data = signGame(gameId, serverAccountSeed);
console.log('Sign is', data.signBase58);
/*sendSignedGame(dappAddress, data.gameIdBase58, data.signBase58, serverAccountSeed);*/
//const r=crypto.base58Decode(crypto.sha256(data.signBase58));
//console.log(Number(r));
//bet(dappAddress, 1, serverAccountSeed);
result(dappAddress, gameId, data.signBase58, serverAccountSeed);
