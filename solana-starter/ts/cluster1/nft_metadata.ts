import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
        const imageUri= "https://devnet.irys.xyz/EVxwjPDKZpQyx4wJqfar3ci1HF5sBUGmwmSL1e9NdsiQ"
        const metadata = {
            name: "jeff",
            symbol: "JEFF",
            description: "umi sucks",
            image: imageUri,
            attributes: [
                {trait_type: "jeff", value: "jeff"}  
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: imageUri
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson([metadata]);
        console.log("Your metadata URI: ", myUri);
        // https://devnet.irys.xyz/HDDWU9EBmtr8QiW5KoDUy1VqKVPui5o6V8kEAhaFxx9F
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
