let dappAddress = null;
let serverAccountAddress = null;
let serverAccountSeed = null;
let isInit = false;
const {invokeScript, broadcast, nodeInteraction, waitForTx, libs} = require('@waves/waves-transactions');
const wc = require('@waves/waves-crypto');
//const delay = require('delay');
const fs = require('fs');
const crypto = wc.crypto();
let config = {
    mainnet: {
        url: 'https://nodes.wavesplatform.com/',
        chainId: 'W',
    },
    testnet: {
        url: 'https://testnodes.wavesnodes.com',
        chainId: 'T',
    }
};
let env = 'testnet';

const init = (customEnv, apiUrl = null, chainId = null, dappAddress1 = null, serverAccountAddress1 = null, serverAccountSeed1 = null) => {
    env = customEnv;
    console.log('Init', customEnv, apiUrl, chainId, dappAddress1, serverAccountAddress1, serverAccountSeed1);
    if (apiUrl) {
        config[customEnv].url = apiUrl;
    }

    if (chainId) {
        config[customEnv].chainId = chainId;
    }

    if (dappAddress1 && serverAccountAddress1 && serverAccountSeed1) {
        dappAddress = dappAddress1;
        serverAccountAddress = serverAccountAddress1;
        serverAccountSeed = serverAccountSeed1;
    } else {
        const config = require('./config.js');
        dappAddress = config[customEnv].dappAddress;
        serverAccountAddress = config[customEnv].serverAccountAddress;
        serverAccountSeed = config[customEnv].serverAccountSeed;
    }

    isInit = true;
    console.log('Dapp: ' + dappAddress);
    console.log('Server address: ' + serverAccountAddress);
};

const getConfig = (key) => {
    return config[env][key];
};

const signGame = (gameId, seed) => {
    const bytes = wc.base58Decode(gameId);
    return crypto.signBytes(seed, bytes);
};

const result = async (dappAddress, gameId, rsa, seed) => {
    const pubKey = crypto.publicKey(seed);

    const txData = invokeScript({
        dApp: dappAddress,
        fee: 500000,
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
        chainId: getConfig('chainId'),
        senderPublicKey: pubKey
    }, seed);

    return broadcast(txData, getConfig('url'));
};

const setStoredGameId = (gameId) => {
    const file = `./${env}.last_game_id.txt`;
    fs.writeFileSync(file, gameId);
};

const getStoredGameId = () => {
    const file = `./${env}last_game_id.txt`;
    let gameId = 0;
    if (fs.existsSync(file)) {
        gameId = Number(fs.readFileSync(file, 'utf8'));
    } else {
        setStoredGameId(gameId);
    }

    return gameId;
};

const doJob = async () => {
    if (!isInit) {
        init();
    }

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
    if (!gameStatus) {
        return false;
    }

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
    console.log('Tx sent!');
    setStoredGameId(gameId);

    return resultTx;
};

module.exports = {init, doJob, setStoredGameId};
