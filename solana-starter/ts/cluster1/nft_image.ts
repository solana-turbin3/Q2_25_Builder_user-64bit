import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    const image = await readFile(
      "/home/user64bit/Desktop/hello-world/Code/turbin3/solana-starter/ts/cluster1/assets/jeff.png"
    );
    //2. Convert image to generic file.
    const genericFile = createGenericFile(image, "gojo.jpg", {
      contentType: "image/png",
    });
    //3. Upload image
    const [myUri] = await umi.uploader.upload([genericFile]);
    // https://devnet.irys.xyz/JD1MtaKHgvcMajAztpti7YSoxTUzsfyKsEcMf314VxTH
    // https://arweave.net/JD1MtaKHgvcMajAztpti7YSoxTUzsfyKsEcMf314VxTH
    // jeff.png
    // https://devnet.irys.xyz/3rd3pSYG6AHhTgEjsmDnNRLmFtTWzsRgDA8Bdz3hmNyk
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
