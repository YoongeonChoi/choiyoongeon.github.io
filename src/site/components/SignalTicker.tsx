import { hiringSignals } from "@/site/config";

export function SignalTicker() {
  return (
    <div className="signal-ticker" aria-label="Portfolio highlights">
      <div className="signal-track">
        {[...hiringSignals, ...hiringSignals, ...hiringSignals].map((item, idx) => (
          <span key={`${item}-${idx}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
