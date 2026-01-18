import { Stack } from "expo-router";
import { LazorKitProvider } from "@lazorkit/wallet-mobile-adapter";

export default function RootLayout() {
  return (
    <LazorKitProvider
      rpcUrl="https://api.devnet.solana.com"
      portalUrl="https://portal.lazor.sh"
      configPaymaster={{
        paymasterUrl: "https://kora.devnet.lazorkit.com",
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      />
    </LazorKitProvider>
  );
}
