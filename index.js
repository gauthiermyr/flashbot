const ethers = require("ethers");
require('dotenv').config();
const {
    FlashbotsBundleProvider,
} = require("@flashbots/ethers-provider-bundle");

const provider = new ethers.providers.JsonRpcProvider({
    url: "https://goerli.infura.io/v3/075edb29154149ab938799b5a17d61ac",
});
// Standard json rpc provider directly from ethers.js. For example you can use Infura, Alchemy, or your own node.

const authSigner = new ethers.Wallet(
    process.env.PK
);
// `authSigner` is an Ethereum private key that does NOT store funds and is NOT your bot's primary key.
// This is an identifying key for signing payloads to establish reputation and whitelisting

const main = async () => {
    // const abi = await require('./abi.json');

    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        "https://relay-goerli.flashbots.net",
        "goerli"
    );

    //wrapped ether
    // const contract = new ethers.Contract("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", abi, provider);
    // const rawTx = await contract.populateTransaction.deposit({ value: 1 });
    // console.log(rawTx);

    // const signedBundle = await flashbotsProvider.signBundle([
    //     {
    //         signer: authSigner,
    //         transaction: rawTx,
    //     },
    // ]);

    const signedBundle = await flashbotsProvider.signBundle([
        {
            signer: authSigner,
            transaction: {
                to: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                gasPrice: 150,
                gasLimit: 21000,
                chainId: 5,
                value: "0x01",
            },
        },
        {
            signer: authSigner,
            transaction: {
                to: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                gasPrice: 150,
                gasLimit: 21000,
                chainId: 5,
                value: "0x01",
            },
        },
    ]);

    const blockNumber = await provider.getBlockNumber();

    const bundleReceipt = await flashbotsProvider.simulate(
        signedBundle,
        blockNumber + 1
    );

    console.log(bundleReceipt)
}

main().then(console.log)