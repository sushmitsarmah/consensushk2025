"use client";

import { UniqueSDKProvider } from "@/web3/lib/sdk";
import { AccountsProvider } from "@/web3/lib/wallets";
import { type ReactNode } from "react";

export function Providers(props: { children: ReactNode }) {
  return (
    <AccountsProvider>
      <UniqueSDKProvider>{props.children}</UniqueSDKProvider>
    </AccountsProvider>
  );
}
