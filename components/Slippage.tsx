'use client';
export function Slippage({ value, onChange }: { value: number, onChange: (n:number)=>void }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-neutral-400">Slippage:</span>
      {[10,50,100].map(bps => (
        <button key={bps} onClick={()=>onChange(bps)}
          className={"px-3 py-1 rounded-lg border " + (value===bps ? "border-brand bg-brand/20" : "border-neutral-800 bg-neutral-900")}>
          {bps/100}%
        </button>
      ))}
    </div>
  );
}
