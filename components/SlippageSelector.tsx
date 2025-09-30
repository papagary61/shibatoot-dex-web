"use client";

import { useState } from "react";

type Props = {
  /** Current slippage in percent, e.g. 0.5 for 0.5% */
  value: number;
  /** Called whenever slippage changes */
  onChange: (v: number) => void;
  /** Threshold that triggers a warning confirm dialog */
  highWarnPct?: number; // default 3
  /** Optional: presets to show as quick buttons */
  presets?: number[]; // default [0.1, 0.5, 1]
};

export default function SlippageSelector({
  value,
  onChange,
  highWarnPct = 3,
  presets = [0.1, 0.5, 1],
}: Props) {
  const [customOpen, setCustomOpen] = useState(false);
  const [draft, setDraft] = useState<string>("");

  const apply = (pct: number) => {
    if (!Number.isFinite(pct) || pct < 0) return;
    if (pct > highWarnPct) {
      const ok = window.confirm(
        `⚠ High slippage: ${pct}% is above ${highWarnPct}%.\n` +
          `This can cause bad execution on volatile pairs.\n\nContinue?`
      );
      if (!ok) return;
    }
    onChange(round2(pct));
  };

  const openCustom = () => {
    setDraft(String(value));
    setCustomOpen(true);
  };

  const confirmCustom = () => {
    const pct = Number(draft);
    if (!Number.isFinite(pct) || pct < 0 || pct > 50) {
      alert("Enter a valid slippage between 0 and 50%");
      return;
    }
    apply(pct);
    setCustomOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-300">Slippage</div>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => apply(p)}
            className={`px-3 py-1 rounded-lg border transition ${
              value === p
                ? "bg-pink-600 text-white border-pink-500"
                : "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700"
            }`}
          >
            {p}%
          </button>
        ))}

        <button
          onClick={openCustom}
          className={`px-3 py-1 rounded-lg border transition ${
            !presets.includes(value)
              ? "bg-pink-600 text-white border-pink-500"
              : "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700"
          }`}
          title="Set a custom slippage"
        >
          Custom
        </button>
      </div>

      <div className="text-xs text-gray-400">
        Current: <span className="text-pink-400">{value}%</span>
      </div>

      {/* Lightweight custom modal */}
      {customOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[380px] rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl">
            <div className="text-base font-semibold">Custom slippage</div>
            <div className="mt-1 text-xs text-zinc-400">
              Enter a percentage (e.g. 0.5 for 0.5%). Values above {highWarnPct}% will ask
              for confirmation.
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                inputMode="decimal"
                placeholder="0.5"
                className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 outline-none"
              />
              <div className="text-sm text-zinc-300">%</div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setCustomOpen(false)}
                className="rounded-md border border-zinc-700 px-3 py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmCustom}
                className="rounded-md bg-pink-600 px-3 py-2 text-white"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
