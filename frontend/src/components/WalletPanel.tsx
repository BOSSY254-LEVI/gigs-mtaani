import { useState, type FormEvent } from "react";

type WalletPanelProps = {
  wallets: Array<{
    id?: string;
    currency: string;
    available: number;
    pending: number;
    ledgerEntries?: Array<{
      id: string;
      entryType: string;
      direction: string;
      amount: number;
      createdAt: string;
    }>;
  }>;
  onTopUp: (amount: number) => Promise<void>;
};

export function WalletPanel({ wallets, onTopUp }: WalletPanelProps) {
  const [amount, setAmount] = useState(500);
  const [busy, setBusy] = useState(false);

  async function submitTopup(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await onTopUp(amount);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <h3>Wallet & Escrow</h3>
      <div className="wallet-grid">
        {wallets.map((wallet, index) => (
          <article className="wallet-card" key={wallet.id || index}>
            <h4>{wallet.currency}</h4>
            <p>Available: {Number(wallet.available).toFixed(2)}</p>
            <p>Pending: {Number(wallet.pending).toFixed(2)}</p>
            <div className="ledger-mini">
              {(wallet.ledgerEntries ?? []).slice(0, 5).map((entry) => (
                <div key={entry.id} className="ledger-row">
                  <span>{entry.entryType}</span>
                  <strong>{entry.direction === "CREDIT" ? "+" : "-"}{Number(entry.amount).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <form onSubmit={submitTopup} className="inline-form">
        <input type="number" min={50} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <button type="submit" disabled={busy}>{busy ? "Processing..." : "Top Up"}</button>
      </form>
    </section>
  );
}
