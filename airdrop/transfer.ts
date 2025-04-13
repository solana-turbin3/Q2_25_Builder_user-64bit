import {
  Transaction,
  SystemProgram,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));

const to = new PublicKey("EnV4PUZB3peLknM87eQ6TQLSdR9J3thLMJx6qJiGKBqw");
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const balance = await connection.getBalance(from.publicKey);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance,
      })
    );
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;
    transaction.feePayer = from.publicKey;
    const fee =
      (
        await connection.getFeeForMessage(
          transaction.compileMessage(),
          "confirmed"
        )
      ).value || 0;
    // Remove our transfer instruction to replace it
    transaction.instructions.pop();

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);
    console.log(`Success! Check out your TX here:
  https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
