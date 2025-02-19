import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WalletModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const wallets = [
    { name: "MetaMask", icon: "🦊" },
    { name: "WalletConnect", icon: "🔗" },
    { name: "Coinbase Wallet", icon: "💰" },
]

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Connect Wallet</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {wallets.map((wallet) => (
                        <Button
                            key={wallet.name}
                            variant="outline"
                            className="w-full justify-between"
                            onClick={() => {
                                console.log(`Connecting to ${wallet.name}`)
                                onOpenChange(false)
                            }}
                        >
                            <span>{wallet.name}</span>
                            <span className="text-2xl">{wallet.icon}</span>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}