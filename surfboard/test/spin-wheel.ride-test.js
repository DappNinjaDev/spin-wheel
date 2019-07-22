const wvs = 10 ** 8;

describe('Spin wheel test suite', async function () {
    this.timeout(100000);

    before(async function () {
        await setupAccounts(
            {
                player1: 2 * wvs,
                //player2: 100 * wvs,
                //player3: 100 * wvs,
                wallet: 1 * wvs
            });
        const script = compile(file('spin-wheel.ride'));
        const ssTx = setScript({script}, accounts.wallet);
        await broadcast(ssTx);
        await waitForTx(ssTx.id);
        console.log('Script has been set');
    });

    it('Bet', async function () {
        const iTxFoo = invokeScript({
            dApp: address(accounts.wallet),
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
                    amount: 100500000,
                    assetId: null
                }
            ]
        }, accounts.player1);

        /*const iTxBar = invokeScript({
            dApp: address(accounts.wallet),
            call: {
                function: "bet",
                args: [
                    {
                        type: "integer", value: 20
                    }
                ]
            },
            payment: [{assetId: null, asset: null, amount: 800500000}]
        }, accounts.player2);*/

        /*const iTxBar1 = invokeScript({
            dApp: address(accounts.wallet),
            call: {
                function: "bet",
                args: [
                    {
                        type: "integer", value: 20
                    }
                ]
            },
            payment: [{assetId: null, amount: (3 + 0.005) * wvs}]
        }, accounts.player3);*/

        await broadcast(iTxFoo);
        //await broadcast(iTxBar);
        //await broadcast(iTxBar1);
        await waitForTx(iTxFoo.id);
        //await waitForTx(iTxBar.id);
        //await waitForTx(iTxBar1.id);
    });

    /*it('Can withdraw', async function () {
        const iTxFoo = invokeScript({
            dApp: address(accounts.wallet),
            call: {
                function: "withdraw",
                args: [{type: 'integer', value: 0.9 * wvs}]
            },

        }, accounts.foofoofoofoofoofoofoofoofoofoofoo);
        await broadcast(iTxFoo)
    });*/
});
