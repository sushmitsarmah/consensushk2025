"use client"

import Link from "next/link"
import { WalletModal } from "@/components/elems/wallet-modal"

export function Navbar() {

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
                                href="/"
                                className="text-sm font-medium text-slate-500 hover:text-slate-700"
                            >
                                My Collections
                            </Link>
                            <Link
                                href="/create-collection"
                                className="text-sm font-medium text-slate-500 hover:text-slate-700"
                            >
                                Create Collection
                            </Link>
                        </div>
                    </div>
                    <WalletModal />
                </div>
            </div>
        </nav>
    )
}