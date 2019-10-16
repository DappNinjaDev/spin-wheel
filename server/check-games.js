const daemonLib = require('./daemon-lib');
const config = require('./config.js');
const env = 'mainnet';

daemonLib.init(env);
const rsaPrivateKey = config[env].rsaPrivateKey;
const dappAddress = config[env].dappAddress;
const seed = config[env].serverAccountSeed;

/*const doIt = async () => {
    //daemonLib.init('mainnet');
    for (let i = 1792; i <= 10000; i++) {
        try {
            const result = await daemonLib.getGameResult(i);
            console.log(`Game ${i}, ${result}`);
            if (!result) {
                console.log('Exit because empty result');
                break;
            }
        } catch (e) {
            console.log('Error: ' + e.message);
        }
    }
};

doIt().then(console.log);*/

/*const checkBets = async () => {
    for (let i = 2017; i <= 2024; i++) {
        console.log(i);
        const data = await daemonLib.gameInfo(i.toString());
        console.log(data);
    }
};

checkBets()
    .then(data => console.log);
return;*/
const gameId = '2017';
/*daemonLib.gameInfo(gameId)
    .then(data => {
        console.log(data);
    });

return;*/
/*daemonLib.getGameTxById(gameId)
    .then(data => {
        console.log(data.value);
        const gameId = data.value;
        const sign = daemonLib.signGame(gameId, rsaPrivateKey);
        //console.log(sign);
        daemonLib.result(dappAddress, gameId, sign, seed)
            .then(result => {
                console.log(result);
                //console.log(result.call.args);
            });
    });

*/
