import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VaultAnchor } from "../target/types/vault_anchor";

describe("vault-anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.VaultAnchor as Program<VaultAnchor>;
  const [vaultStatePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), provider.publicKey.toBytes()],
    program.programId
  );

  const [vaultPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultStatePda.toBytes()],
    program.programId
  );

  it("Is initialized!", async () => {
    console.log("helllo");
    console.log("vaultStatePda", vaultStatePda.toBase58());
    console.log("vaultPda", vaultPda.toBase58());
    const tx = await program.methods
      .initialize()
      .accountsPartial({
        user: provider.wallet.publicKey,
        vaultState: vaultStatePda,
        vault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("reach here.....");
    console.log("Your transaction signature", tx);
    console.log(
      "Your vault Info",
      await provider.connection.getAccountInfo(vaultPda)
    );
  });

  it("Deposit 2 SOL", async () => {
    const tx = await program.methods
      .deposite(new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL))
      .accountsPartial({
        user: provider.wallet.publicKey,
        vaultState: vaultStatePda,
        vault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);
    console.log(
      "Your vault Info",
      await provider.connection.getAccountInfo(vaultPda)
    );
  });

  it("Withdraw 1 SOL", async () => {
    const tx = await program.methods
      .withdraw(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL))
      .accountsPartial({
        user: provider.wallet.publicKey,
        vaultState: vaultStatePda,
        vault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);
    console.log(
      "Your vault Info",
      await provider.connection.getAccountInfo(vaultPda)
    );
  });

  it("close vault", async () => {
    const tx = await program.methods
      .close()
      .accountsPartial({
        user: provider.wallet.publicKey,
        vaultState: vaultStatePda,
        vault: vaultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);
    console.log(
      "Your vault Info",
      await provider.connection.getAccountInfo(vaultPda)
    );
  });
});
