const {dappAddress, serverAccountAddress, serverAccountSeed} = require('./config.js');
const {invokeScript, broadcast, nodeInteraction, waitForTx} = require('@waves/waves-transactions');
const wc = require('@waves/waves-crypto');
const delay = require('delay');
const fs = require('fs');
const crypto = wc.crypto();
const config = {
    prod: {},
    dev: {
        url: 'https://testnodes.wavesnodes.com'
    }
};

console.log('Dapp: ' + dappAddress);
console.log('Server address: ' + serverAccountAddress);

const getConfig = (key) => {
    return config['dev'][key];
};

const signGame = (gameId, seed) => {
    const bytes = wc.base58Decode(gameId);
    return crypto.signBytes(seed, bytes);
};

const result = async (dappAddress, gameId, rsa, seed) => {
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

    return broadcast(txData, getConfig('url'));

};

const setStoredGameId = (gameId) => {
    const file = './last_game_id.txt';
    fs.writeFileSync(file, gameId);
};

const getStoredGameId = () => {
    const file = './last_game_id.txt';
    let gameId = 0;
    if (fs.existsSync(file)) {
        gameId = Number(fs.readFileSync(file, 'utf8'));
    } else {
        setStoredGameId(gameId);
    }

    return gameId;
};

const doJob = async () => {
    let gameId = getStoredGameId();
    gameId++;
    console.log('Check game...', gameId);
    const gameData = await nodeInteraction.accountDataByKey(`USER_GAME_ID_${gameId}`, dappAddress, getConfig('url'));
    //console.log('Game data', gameData.value);
    if (!gameData) {
        console.log('Game not found');
        return false;
    }

    const gameStatus = await nodeInteraction.accountDataByKey(`${gameData.value}_STATUS`, dappAddress, getConfig('url'));
    //console.log(gameStatus);
    if (gameStatus.value !== 'NEW') {
        console.log('Game already done');
        setStoredGameId(gameId);
        return false;
    }

    console.log('Game data', gameData.value);
    const sign = signGame(gameData.value, serverAccountSeed);
    console.log('Sign is', sign);
    const resultTx = await result(dappAddress, gameData.value, sign, serverAccountSeed);
    console.log('Result tx', resultTx.id, 'wait..');
    // todo wait or sign next tx?
    //await waitForTx(resultTx.id, getConfig('url'));
    console.log('Tx done!');
    setStoredGameId(gameId);

    return true;
};

(async () => {
    while (true) {
        const done = await doJob();
        console.log('Iteration ' + done);
        if (!done) {
            await delay(1000);
        }
    }
})();
