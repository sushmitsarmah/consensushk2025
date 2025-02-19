"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useCallback, useEffect, useState } from "react";
import PolkadotWalletSelector from "@/app/components/accounts/PolkadotWalletSelector";
import { useSdkContext } from "@/app/lib/sdk/UniqueSDKProvider";
import { useAccountsContext } from "@/app/lib/wallets/AccountsProvider";
import { Button } from "../ui/button";
import { Wallet } from "lucide-react";
import { shortPolkadotAddress } from "@/app/lib/utils";

const DEFAULT_DECIMALS = 18;

export function WalletModal() {
    const { sdk } = useSdkContext();
    const accountContext = useAccountsContext();
    const [balance, setBalance] = useState("");
    const [decimals, setDecimals] = useState<number>(DEFAULT_DECIMALS);
    const [showWalletModal, setShowWalletModal] = useState(false)

    const getBalance = useCallback(async () => {
        if (!sdk || !accountContext?.activeAccount) return;

        const bal = await sdk.balance.get({
            address: accountContext.activeAccount.address,
        });

        setBalance(bal.available);
        setDecimals(bal.decimals);
    }, [accountContext?.activeAccount, sdk]);

    useEffect(() => {
        getBalance();
    }, [getBalance]);

    const disconnect = () => {
        if (!sdk || !accountContext?.disconnectWallet) return;

        accountContext.disconnectWallet();

    };


    const formattedBalance = balance
        ? (() => {
            try {
                const num = BigInt(balance).toString().padStart(decimals + 1, "0");
                return decimals ? `${num.slice(0, -decimals)}.${num.slice(-decimals)}` : num;
            } catch {
                return '';
            }
        })()
        : '...';

    const showAddress = () => {
        return shortPolkadotAddress(accountContext?.activeAccount?.address || "");
    }

    return (
        <>
            <Button onClick={() => setShowWalletModal(true)}>
                {accountContext?.activeAccount
                    ? <p className="font-bold">{showAddress()}</p>
                    : <div className="flex flex-row gap-1">
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                    </div>}
            </Button>
            <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <div>
                                <h1>Wallet Details</h1>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {accountContext?.activeAccount ? (
                            <>
                                <div className="grid grid-cols-4 gap-2">
                                    <p className="col-span-1 font-medium">Address:</p>
                                    <p className="col-span-3 font-bold truncate">{showAddress()}</p>
                                    <p className="col-span-1 font-medium">Balance:</p>
                                    <p className="col-span-3 font-bold">{formattedBalance}</p>
                                </div>
                                <Button onClick={disconnect}>
                                    Disconnect Wallet
                                </Button>
                            </>) :
                            <PolkadotWalletSelector />
                        }

                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}