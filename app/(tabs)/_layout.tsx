import { Stack } from "expo-router";
import { LazorKitProvider } from "@lazorkit/wallet-mobile-adapter";

export default function RootLayout() {
  return (
    <LazorKitProvider
      rpcUrl="https://devnet.helius-rpc.com/?api-key=b350b993-1ca8-4557-95aa-9e96897cce14"
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
