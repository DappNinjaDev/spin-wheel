const wvs = 10 ** 8;
const maxBets = 100;
const bet = 100000000;

describe('Spin wheel test suite', async function () {
    this.timeout(0);

    before(async function () {
        //const userBetsBalanceWithoutFee = 2000000000 * maxBets;
        const userBetsBalanceWithoutFee = bet * maxBets;
        const userBetsBalance = (bet + 1000000) * maxBets;
        await setupAccounts(
            {
                // server which sign transactions for random
                //server: 100 * wvs,
                server: 0,
                // smart contract
                dapp: userBetsBalanceWithoutFee,
                player1: userBetsBalance,
            });

        const serverPublicKey = publicKey(accounts.server);
        const serverAddress = address(accounts.server);
        console.log('Public key', serverPublicKey, 'serverAddress', serverAddress);
        let contract = file('spin-wheel.ride').replace('{{server_address}}', serverAddress).replace('{{server_public_key}}', serverPublicKey);
        const script = compile(contract);
        const ssTx = setScript({script}, accounts.dapp);
        await broadcast(ssTx);
        await waitForTx(ssTx.id);
        console.log('Script has been set');
    });

    it('Bet', async function () {
        const promises = [];
        for (let i = 0; i < maxBets; i++) {
            console.log('Bet ' + i);
            const tx = invokeScript({
                dApp: address(accounts.dapp),
                call: {
                    function: "bet",
                    args: [
                        {
                            type: "integer",
                            value: 2
                        }
                    ]
                },
                payment: [
                    {
                        amount: (bet + 500000),
                        assetId: null
                    }
                ]
            }, accounts.player1);

            await broadcast(tx);
            promises.push(waitForTx(tx.id));
        }

        const result = await Promise.all(promises);
        console.log('Promises complete');
    });

    it('Sign txs for random', async function () {
        const daemonLib = require('../../server/daemon-lib');
        const promises = [];
        const dappAddress = address(accounts.dapp);
        const serverAddress = address(accounts.server);
        //const serverSeed = privateKey(accounts.server);
        const serverSeed = accounts.server;
        daemonLib.init('testnet', 'http://localhost:6869/', 'R', dappAddress, serverAddress, serverSeed);
        let counter = 0;
        daemonLib.setStoredGameId(0);
        while (true) {
            const doneTx = await daemonLib.doJob();
            console.log('Iteration', counter, !!doneTx);
            if (doneTx) {
                promises.push(waitForTx(doneTx.id));
                counter++;
                if (counter >= maxBets) {
                    console.log('Last count', counter);
                    break;
                }
            }

            if (!doneTx) {
                await new Promise(((resolve, reject) => {
                    setTimeout(resolve, 1000);
                }));
            }
        }

        const result = await Promise.all(promises);
    });

    it('Check balances', async function () {
        var assert = chai.assert;
        const dappBalance = await balance(address(accounts.dapp));
        const serverBalance = await balance(address(accounts.server));
        const playerBalance = await balance(address(accounts.player1));

        console.log('Dapp balance', dappBalance, dappBalance / wvs);
        console.log('Server balance', serverBalance);
        console.log('Player balance', playerBalance, playerBalance / wvs);
        assert.equal(serverBalance, 0, "Server with coins. Strange.");
    });
});
