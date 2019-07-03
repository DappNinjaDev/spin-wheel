const {dappAddress, serverAccountAddress, serverAccountPublicKey, serverAccountSeed} = require('./config.js');
const {invokeScript, broadcast, waitForTx} = require('@waves/waves-transactions');
const wc = require('@waves/waves-crypto');
const crypto = wc.crypto();
const fetch = require('node-fetch');

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
    return new Promise((resolve, reject) => {
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
                //console.log(tx);
                console.log('tx id:', tx.id);
                /*
                return waitForTx(tx.id)
                    .then(result => {
                        console.log('result is');
                        console.log(result);
                        resolve(result);
                    })
                    .catch(reject);*/
                setTimeout(_ => {
                    resolve(tx.id);
                }, 10000)
            })
            .catch(error => {
                console.log('Error: ' + error.message);
                //console.log(error);
                reject(error);
            });
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
        .then(resp => {
            console.log(resp);
            return resp;
        })
        .catch(error => {
            console.log('Error: ' + error.message);
            //console.log(error);
        });
};


/*sendSignedGame(dappAddress, data.gameIdBase58, data.signBase58, serverAccountSeed);*/
//const r=crypto.base58Decode(crypto.sha256(data.signBase58));
//console.log(Number(r));
bet(dappAddress, 2, 100500000, serverAccountSeed)
    .then((txId) => {
        //const gameId = '21hVN9jMTvtS5Hmft9YoL1ch8uKgNKvwL8WeSpFAmqNi';
        const sign = signGame(txId, serverAccountSeed);
        console.log('Sign is', sign);
        result(dappAddress, txId, sign, serverAccountSeed)
            .then(async _ => {
                // todo check https://testnodes.wavesnodes.com/addresses/data/3N8M61KCm8G72mK8PjacFbnnxdbFsyqQDeT/HPiQq6cq4Q5VKiUTwrcb1v6AxZcorRwPC1wWbai26gec_STATUS
                for (let i = 0; i <= 500; i++) {
                    const response = await fetch(`https://testnodes.wavesnodes.com/addresses/data/${dappAddress}/${txId}_STATUS`);
                    const json = await response.json();
                    console.log(json);
                    if (json.value !== "NEW") {
                        console.log(json.value);
                        return;
                    }
                }
            });
    });

