"use client"

import Link from "next/link"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WalletModal } from "@/components/elems/wallet-modal"
import { useState } from "react"

export function Navbar() {
    const [showWalletModal, setShowWalletModal] = useState(false)

    return (
        <nav className="border-b bg-white">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            NFT Platform
                        </Link>
                        <div className="hidden sm:flex sm:gap-6">
                            <Link
                                href="/my-nfts"
                                className="text-sm font-medium text-slate-500 hover:text-slate-700"
                            >
                                My NFTs
                            </Link>
                            <Link
                                href="/create-collection"
                                className="text-sm font-medium text-slate-500 hover:text-slate-700"
                            >
                                Create Collection
                            </Link>
                        </div>
                    </div>
                    <Button onClick={() => setShowWalletModal(true)}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                    </Button>
                </div>
            </div>
            <WalletModal open={showWalletModal} onOpenChange={setShowWalletModal} />
        </nav>
    )
}