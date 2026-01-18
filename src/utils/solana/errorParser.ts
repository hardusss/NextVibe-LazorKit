// src/utils/solana/errorParser.ts

export const getFriendlyErrorMessage = (error: any): string => {
    const message = error?.message || error?.toString() || "Unknown error";

    if (message.includes("Transaction too large") || message.includes("1232")) {
        return "Transaction data size exceeded. Please swipe again.";
    }
    if (
        message.includes("Insufficient funds") || 
        message.includes("0x1") || 
        message.includes("Transfer: insufficient lamports")
    ) {
        return "Insufficient balance to pay for gas fee.";
    }

    if (
        message.includes("TransactionTooOld") || 
        message.includes("Transaction is too old") ||
        message.includes("6019") ||
        message.includes("0x1783") || 
        message.includes("Blockhash not found")
    ) {
        return "Network timed out. Please swipe again.";
    }

    if (
        message.includes("Instruction 0: custom program error: 0x2") || 
        message.includes("WALLET_CORRUPTED")
    ) {
        return "Wallet Error: Please create a new wallet via Dashboard.";
    }

    if (message.includes("User rejected") || message.includes("Signature request denied")) {
        return "Transaction cancelled.";
    }

    return "Transaction failed. Please try again.";
};